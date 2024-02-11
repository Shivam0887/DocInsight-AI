import { router } from "./trpc";
import {
  authCallback,
  getFileUploadStatus,
  getFiles,
  getFile,
  deleteFile,
  uploadFileFromUrl,
  getFileMessages,
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
});

export type AppRouter = typeof appRouter;
