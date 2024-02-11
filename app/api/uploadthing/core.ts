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

const f = createUploadthing();

export const ourFileRouter = {
  FileUploader: f({
    "application/pdf": { maxFileSize: "4MB" },
    "text/plain": { maxFileSize: "4MB" },
  })
    .middleware(async () => {
      const user = await currentUser();
      if (!user || !user.id)
        throw new Error("You must be logged in to upload a file");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      connectToDB();
      const user = await User.findOne<UserType | null>({
        userId: metadata.userId,
      });

      if (!user) throw new Error("User not found");

      const { key, name, url, size } = file;

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
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
