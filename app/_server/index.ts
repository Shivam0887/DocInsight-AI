import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { currentUser } from "@clerk/nextjs";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/lib/models/models";

//Creating appRouter instance

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const currUser = await currentUser();

    if (!currUser?.id) throw new TRPCError({ code: "UNAUTHORIZED" });

    try {
      connectToDB();
      const dbUser = await User.findOne({ userId: currUser.id });

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
  }),
});

export type AppRouter = typeof appRouter;
