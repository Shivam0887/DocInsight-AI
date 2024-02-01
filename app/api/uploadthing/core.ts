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

      await User.findByIdAndUpdate(user._id, {
        $push: {
          files: dbFile._id,
        },
      });

      return {
        userId: metadata.userId,
        fileId: dbFile._id.toString(),
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
