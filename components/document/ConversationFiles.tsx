"use client";

import { trpc } from "@/app/_trpc/client";
import { Loader2, MessageSquare, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const ConversationFiles = () => {
  const { data, isLoading } = trpc.getFiles.useQuery();
  const params = useParams();

  return (
    <div className="flex mt-2 justify-center w-full">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        data?.map((file) => (
          <div
            key={file.docId}
            className={`flex w-full items-center hover:bg-zinc-100 rounded-md p-2 gap-2 transition ${
              file._id.toString() === params.fileId ? "bg-zinc-100" : ""
            }`}
          >
            <Link
              href={`/conversations/${file._id.toString()}`}
              className="flex items-center flex-1"
            >
              <MessageSquare className="h-5 w-5" />
              <p className="ml-2 text-sm font-medium text-zinc-900">
                {file.name}
              </p>
            </Link>
            <button
              aria-label="more options"
              className="bg-zinc-100 py-1.5 rounded-sm"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ConversationFiles;
