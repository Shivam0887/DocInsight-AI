import Description from "@/components/Description";
import { connectToDB } from "@/lib/connectToDB";
import { User, UserType } from "@/lib/models/models";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { userId } = auth();

  connectToDB();
  const user = await User.findOne<UserType | undefined>({ userId });

  if (user?.files.length) redirect("/conversations");

  return <Description />;
}
