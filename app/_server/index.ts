import { router } from "./trpc";
import {
  authCallback,
  getFiles,
  getFile,
  deleteFile,
  uploadFileFromUrl,
} from "@/app/_server/routes";

//Creating appRouter instance
export const appRouter = router({
  authCallback,
  getFiles,
  getFile,
  deleteFile,
  uploadFileFromUrl,
});

export type AppRouter = typeof appRouter;
