import { router } from "./trpc";
import {
  authCallback,
  getFiles,
  uploadFileFromUrl,
} from "@/app/_server/routes";

//Creating appRouter instance
export const appRouter = router({
  authCallback,
  getFiles,
  uploadFileFromUrl,
});

export type AppRouter = typeof appRouter;
