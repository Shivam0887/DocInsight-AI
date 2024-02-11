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

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "@/lib/pinecone";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";

const utapi = new UTApi();

export const authCallback = publicProcedure.query(async () => {
  const currUser = await currentUser();

  if (!currUser?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  try {
    connectToDB();
    const dbUser = await User.findOne<UserType | null>({ userId: currUser.id });

    if (!dbUser) {
      await User.create({
        userId: currUser.id,
        email: currUser.emailAddresses[0].emailAddress,
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

  connectToDB();
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

    const file = await File.findOne<FileType | null>({
      _id: input.fileId,
      user: user._id,
    });

    return !file
      ? { status: "PENDING" as const }
      : { status: file.uploadStatus };
  });

export const getFile = privateProcedure
  .input(z.object({ fileId: z.string() }))
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;

    connectToDB();
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
  .input(z.object({ fileId: z.string(), docId: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;

    connectToDB();
    const user = await User.findOne<UserType | null>({ userId });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const userFile = await File.findOneAndDelete<FileType | null>(
      {
        _id: input.fileId,
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
  .input(z.object({ securedUrl: z.string() }))
  .mutation(async ({ ctx, input }) => {
    const user = await User.findOne<UserType | null>({ userId: ctx.userId });
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" });

    const { data } = await utapi.uploadFilesFromUrl(input.securedUrl);

    if (!data) throw new Error("please provide url");

    const { key, name, url, size } = data;

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

      // vector embedding
      const genEmbeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      });

      await PineconeStore.fromDocuments(docs, genEmbeddings, {
        pineconeIndex,
        namespace: dbFile._id.toString(),
      });

      await File.findByIdAndUpdate(dbFile._id, {
        $set: {
          uploadStatus: UploadStatus.SUCCESS,
          pages,
        },
      });

      await User.findByIdAndUpdate(user._id, {
        $push: {
          files: dbFile._id,
        },
      });

      return {
        userId: ctx.userId,
        fileId: dbFile._id.toString(),
      };
    } catch (error: any) {
      console.log("error - ", error.any);
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
