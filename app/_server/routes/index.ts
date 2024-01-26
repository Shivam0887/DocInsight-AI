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

type userWithFilesType = Omit<UserType, "files"> & { files: FileType[] };

const utapi = new UTApi();

export const authCallback = publicProcedure.query(async () => {
  const currUser = await currentUser();

  if (!currUser?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

  try {
    connectToDB();
    const dbUser = await User.findOne<UserType>({ userId: currUser.id });

    if (!dbUser?.userId) {
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

export const getFiles = privateProcedure
  .input(z.object({ countOnly: z.boolean().optional().default(false) }))
  .query(async ({ ctx, input }) => {
    const { userId } = ctx;

    connectToDB();
    const dbUser = await User.findOne<UserType | null>({ userId });
    if (!dbUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    if (input.countOnly) {
      return dbUser;
    }

    const userFiles = await User.findOne<userWithFilesType | null>({
      userId,
    }).populate({
      path: "files",
      model: File,
    });

    return userFiles;
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
      const { key, name, url } = data;
      dbFile = await File.create({
        name,
        key,
        url,
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
