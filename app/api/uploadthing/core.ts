import { connectToDB } from "@/lib/connectToDB";

import {
  File,
  FileType,
  User,
  UserType,
  UploadStatus,
} from "@/lib/models/models";
import { currentUser } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { randomUUID } from "crypto";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { pineconeIndex } from "@/lib/pinecone";
import { getUserSubscriptionPlan } from "@/lib/stripe";
import { PLANS } from "@/config/stripe";
import { genAI } from "@/lib/ai";

const f = createUploadthing();

const middleware = async () => {
  const user = await currentUser();
  if (!user || !user.id)
    throw new Error("You must be logged in to upload a file");

  const subscriptionPlan = await getUserSubscriptionPlan();
  return { subscriptionPlan, userId: user.id };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
    size: number;
  };
}) => {
  connectToDB();
  const user = await User.findOne<UserType | null>({
    userId: metadata.userId,
  });

  if (!user) throw new Error("User not found");

  const { key, name, url, size } = file;

  const isFileExist = await File.findOne<FileType>({ key });

  if (isFileExist) return;

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

    const { subscriptionPlan } = metadata;
    const { isSubscribed } = subscriptionPlan;

    const isProExceeded =
      pages > PLANS.find((plan) => plan.name === "Pro")!.pagesPerPDF;
    const isFreeExceeded =
      pages > PLANS.find((plan) => plan.name === "Free")!.pagesPerPDF;

    if ((isSubscribed && isProExceeded) || (!isSubscribed && isFreeExceeded)) {
      await File.findByIdAndUpdate(dbFile._id, {
        $set: {
          uploadStatus: UploadStatus.FAILED,
          pages,
        },
      });
    } else {
      // vector embedding
      const genEmbeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        modelName: "text-embedding-3-small",
      });

      const model = genAI.getGenerativeModel({
        model: "gemini-pro",
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
      userId: metadata.userId,
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
};

export const ourFileRouter = {
  freePlanFileUploader: f({
    "application/pdf": { maxFileSize: "4MB" },
  })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanFileUploader: f({
    "application/pdf": { maxFileSize: "16MB" },
  })
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
