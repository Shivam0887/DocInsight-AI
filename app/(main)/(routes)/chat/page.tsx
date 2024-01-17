import Dashboard from "@/components/Dashboard";
import { connectToDB } from "@/lib/connectToDB";
import { User } from "@/lib/models/models";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ChatPage() {
  const { userId } = auth();

  connectToDB();
  const user = await User.findOne({ userId });

  if (user?.isConversation) redirect("/conversations");

  return <Dashboard />;
}
