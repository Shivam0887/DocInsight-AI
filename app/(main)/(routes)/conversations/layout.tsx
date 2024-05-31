import UserFiles from "@/components/document/UserFiles";
import { connectToDB } from "@/lib/connectToDB";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  connectToDB();
  const { userId } = auth();
  if (!userId) redirect("/auth-callback?origin=/");

  return (
    <div className="flex overflow-hidden h-[calc(100vh-64px)]">
      <UserFiles className="hidden xl:block" />
      {children}
    </div>
  );
}
