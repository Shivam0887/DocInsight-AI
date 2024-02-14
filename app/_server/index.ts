import { router } from "./trpc";
import {
  authCallback,
  getFileUploadStatus,
  getFiles,
  getFile,
  deleteFile,
  uploadFileFromUrl,
  getFileMessages,
  createStripeSession,
  deleteChat,
} from "@/app/_server/routes";

//Creating appRouter instance
export const appRouter = router({
  authCallback,
  getFileUploadStatus,
  getFiles,
  getFile,
  deleteFile,
  uploadFileFromUrl,
  getFileMessages,
  createStripeSession,
  deleteChat,
});

export type AppRouter = typeof appRouter;
