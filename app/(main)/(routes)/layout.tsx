import { connectToDB } from "@/lib/connectToDB";
import { File, FileType, User, UserType } from "@/lib/models/models";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

type userWithFiles = Omit<UserType, "files"> & { files: FileType[] };

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();
  if (!userId) redirect("/auth-callback?origin=chat");

  try {
    connectToDB();
    const user = await User.findOne<userWithFiles | null>({ userId }).populate({
      path: "files",
      model: File,
    });

    if (!user) throw new Error("User not found");
  } catch (error: any) {
    console.log(error.message);
  }

  return <div>{children}</div>;
}
