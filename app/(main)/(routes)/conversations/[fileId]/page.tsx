import ChatWrapper from "@/components/chat/ChatWrapper";
import DocumentRenderer from "@/components/document/DocumentRenderer";
import { connectToDB } from "@/lib/connectToDB";
import { File, FileType, User, UserType } from "@/lib/models/models";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";

const ConversationPage = async ({ params }: { params: { fileId: string } }) => {
  const { fileId } = params;
  const { userId } = auth();
  if (!userId) redirect(`/auth-callback?origin=/conversations/${fileId}`);

  connectToDB();
  const user = await User.findOne<UserType | null>({ userId });
  const file = await File.findOne<FileType | null>({
    _id: fileId,
    user: user?._id,
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh-64px)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex">
        {/* left side */}

        <div className="flex-1 xl:flex">
          <div className="px-4 pt-6 xl:flex-1">
            <DocumentRenderer url={file.url} />
          </div>
        </div>

        {/* right side */}
        <div
          className="shrink-0 flex-[0.75] border-t border-gray-200
          lg:w-96 lg:border-l lg:border-t-0"
        >
          <ChatWrapper />
        </div>
      </div>
    </div>
  );
};

export default ConversationPage;
