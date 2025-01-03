import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure } from "../trpc";
import { currentUser } from "@clerk/nextjs";
import { connectToDB } from "@/lib/connectToDB";
import {
  File,
  FileType,
  Message,
  MessageType,
  UploadStatus,
  User,
  UserType,
} from "@/lib/models/models";
import { randomUUID } from "crypto";
import { UTApi } from "uploadthing/server";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "@/lib/pinecone";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { PLANS } from "@/config/stripe";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { genAI } from "@/lib/ai";
import { ObjectId, Types } from "mongoose";
import Stripe from "stripe";

const utapi = new UTApi();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
  typescript: true,
});

export const authCallback = publicProcedure.query(async () => {
  const currUser = await currentUser();

  if (!currUser?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  try {
    await connectToDB();
    const dbUser = await User.findOne<UserType>({ userId: currUser.id });

    if (!dbUser) {
      await User.create({
        userId: currUser.id,
        email: currUser.emailAddresses[0].emailAddress,
        name: currUser.firstName,
      });
    }

    return { success: true };
  } catch (error: any) {
    console.log("User creation ", error?.message);
    return { success: false };
  }
});

export const getFiles = privateProcedure.query(async ({ ctx }) => {
  const { userId } = ctx;

  await connectToDB();
  const user = await User.findOne<UserType | null>({ userId });
  if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

  const userFiles = await File.find<FileType>({ user: user._id }).sort({
    createdAt: "desc",
  });

  return userFiles;
});

export const getFileUploadStatus = privateProcedure
  .input(
    z.object({
      fileId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const user = await User.findOne<UserType | null>({ userId: ctx.userId });

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    await connectToDB();
    const file = await File.findOne<FileType | null>({
      _id: input.fileId,
      user: user._id,
    });

    return !file
      ? { status: "PENDING" as const }
      : { status: file.uploadStatus };
  });

export const getFile = privateProcedure
  .input(
    z.object({
      fileId: z.string(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;

    await connectToDB();
    const user = await User.findOne<UserType | null>({ userId });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const userFile = await File.findOne<FileType>({
      _id: input.fileId,
      user: user._id,
    });

    if (!userFile) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return userFile;
  });

export const deleteFile = privateProcedure
  .input(
    z.object({
      docId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    await connectToDB();
    const user = await User.findOne<UserType | null>({ userId });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const userFile = await File.findOneAndDelete<FileType | null>(
      {
        user: user._id,
        docId: input.docId,
      },
      { new: true }
    );

    if (!userFile) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    await User.findByIdAndUpdate(user._id, {
      $pull: {
        files: userFile._id,
      },
    });
  });

export const uploadFileFromUrl = privateProcedure
  .input(
    z.object({
      securedUrl: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await User.findOne<UserType | null>({ userId: ctx.userId });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const { data } = await utapi.uploadFilesFromUrl(input.securedUrl);

    if (!data) throw new Error("please provide url");

    const { key, name, url, size } = data;

    await connectToDB();
    const dbFile: FileType = await File.create({
      name,
      key,
      url,
      size,
      user: user._id,
      uploadStatus: UploadStatus.PROCESSING,
      docId: randomUUID(),
    });

    try {
      const res = await fetch(url);
      const blob = await res.blob();

      const loader = new PDFLoader(blob);
      const docs = await loader.load();

      const pages = docs.length;

      const { isSubscribed } = await getUserSubscriptionPlan();

      const isProExceeded =
        pages > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPDF;
      const isFreeExceeded =
        pages > PLANS.find((plan) => plan.name === "Free")!.pagesPerPDF;

      if (
        (isSubscribed && isProExceeded) ||
        (!isSubscribed && isFreeExceeded)
      ) {
        await File.findByIdAndUpdate(dbFile._id, {
          $set: {
            uploadStatus: UploadStatus.FAILED,
            pages,
          },
        });
      } else {
        // vector embedding
        const genEmbeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GOOGLE_GENAI_API_KEY!,
          model: "text-embedding-004",
        });

        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
        });

        const prompt = `${docs[0].pageContent}\n\n Generate the summary of the provided content within 50 words.`;

        const genSummary = await model.generateContent(prompt);
        const summary = genSummary.response.text();

        await PineconeStore.fromDocuments(docs, genEmbeddings, {
          pineconeIndex,
          namespace: dbFile._id.toString(),
        });

        await File.findByIdAndUpdate(dbFile._id, {
          $set: {
            uploadStatus: UploadStatus.SUCCESS,
            pages,
            summary,
          },
        });

        await User.findByIdAndUpdate(user._id, {
          $push: {
            files: dbFile._id,
          },
        });
      }

      return {
        userId: ctx.userId,
        fileId: dbFile._id.toString(),
      };
    } catch (error: any) {
      console.log("error - ", error?.message);
      await File.findByIdAndUpdate(dbFile._id, {
        $set: {
          uploadStatus: UploadStatus.FAILED,
        },
      });
    }
  });

export const getFileMessages = privateProcedure
  .input(
    z.object({
      fileId: z.string(),
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().nullish(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { fileId, cursor } = input;
    const limit = input.limit ?? INFINITE_QUERY_LIMIT;

    await connectToDB();
    const dbUser = await User.findOne({ userId });

    const file = await File.findOne({
      _id: fileId,
      user: dbUser?._id,
    });

    if (!file) throw new TRPCError({ code: "NOT_FOUND" });

    const messages = await Message.find<
      Pick<MessageType, "_id" | "createdAt" | "isUserMessage" | "content">
    >({ fileId }, { content: 1, isUserMessage: 1, createdAt: 1 })
      .sort({ createdAt: "desc" })
      .where({
        createdAt: { $lte: cursor ? cursor : new Date().toISOString() },
      })
      .limit(limit + 1);

    let nextCursor: typeof cursor | undefined = undefined;
    if (messages.length > limit) {
      let lastMessage = messages.pop();
      nextCursor = lastMessage?.createdAt.toISOString();
    }

    return {
      messages,
      nextCursor,
    };
  });

export const createStripeSession = privateProcedure.mutation(
  async ({ ctx }) => {
    const { userId } = ctx;

    try {
      const user = await User.findOne<UserType>({ userId });
      if (!user) throw new TRPCError({ code: "NOT_FOUND" });

      const subscriptionPlan = await getUserSubscriptionPlan();

      if (subscriptionPlan.isSubscribed && user.stripeCustomerId) {
        const stripeSession = await stripe.billingPortal.sessions.create({
          customer: user.stripeCustomerId,
          return_url: `https://doc-insight-ai.vercel.app/settings`,
        });

        return { url: stripeSession.url };
      }

      const customer = await stripe.customers.create({
        name: user.name,
        email: user.email,
      });

      const stripeSession = await stripe.checkout.sessions.create({
        customer: customer.id,
        payment_method_types: ["card"],
        currency: "inr",
        success_url: `https://doc-insight-ai.vercel.app/settings`,
        cancel_url: `https://doc-insight-ai.vercel.app/settings`,
        mode: "subscription",
        line_items: [
          {
            price: PLANS.find((plan) => plan.name === "Pro")?.price.priceIds
              .test,
            quantity: 1,
          },
        ],
        metadata: {
          userId,
        },
      });

      return { url: stripeSession.url };
    } catch (error: any) {
      console.log(error);
    }
  }
);

export const deleteChat = privateProcedure
  .input(
    z.object({
      fileId: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const { fileId } = input;
    await connectToDB();

    const user = await User.findOne<UserType>({ userId: ctx.userId });

    if (!user) throw new TRPCError({ code: "NOT_FOUND" });

    const fileMessages = (await File.findOne<{ messages: ObjectId[] }>(
      { _id: fileId, user: user._id },
      { _id: 0, messages: 1 }
    )) ?? { messages: [new Types.ObjectId()] };

    const fileIds = fileMessages.messages.map(
      (id) => new Types.ObjectId(id.toString())
    );

    await User.findByIdAndUpdate(user._id, {
      $pullAll: {
        messages: [...fileIds],
      },
    });

    await File.findByIdAndUpdate(fileId, {
      $set: {
        messages: [],
      },
    });

    const res = await Message.deleteMany({ fileId });
    return { res };
  });
