import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { privateProcedure, publicProcedure } from "../trpc";
import { currentUser } from "@clerk/nextjs";
import { connectToDB } from "@/lib/connectToDB";
import {
  File,
  FileType,
  UploadStatus,
  User,
  UserType,
} from "@/lib/models/models";
import { randomUUID } from "crypto";
import { UTApi } from "uploadthing/server";

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

    const { data, error } = await utapi.uploadFilesFromUrl(input.securedUrl);

    if (error) throw new Error(error.message);

    let dbFile: FileType | null = null;

    if (data) {
      const { key, name, url, size } = data;
      dbFile = await File.create({
        name,
        key,
        url,
        size,
        user: user._id,
        uploadStatus: UploadStatus.PROCESSING,
        docId: randomUUID(),
      });
    }

    if (dbFile) {
      await User.findByIdAndUpdate(user._id, {
        $push: {
          files: dbFile._id,
        },
      });
    }

    return {
      fileId: dbFile ? dbFile._id.toString() : "",
    };
  });
