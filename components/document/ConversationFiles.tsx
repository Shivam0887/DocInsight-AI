"use client";

import { trpc } from "@/app/_trpc/client";
import { Loader2, MessageSquare, Trash } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

const ConversationFiles = () => {
  const { data, isLoading, refetch } = trpc.getFiles.useQuery();
  const params = useParams();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [fileId, setFileId] = useState("");
  const { mutate } = trpc.deleteChat.useMutation({
    onSuccess: () => {
      refetch();
      router.replace("/conversations");
    },
  });

  //Is conversation exist for each file?
  const isConversationExist =
    data?.every(({ messages }) => messages.length === 0) ?? false;

  return (
    <div className="flex flex-col overflow-y-auto h-[calc(100vh-10rem)] gap-4 mt-2 items-center w-full scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2">
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : !isConversationExist && data ? (
        data.map(
          (file) =>
            file.messages.length > 0 && (
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
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger
                    asChild
                    onClick={() => setFileId(file._id.toString())}
                  >
                    <button aria-label="delete button">
                      <Trash className="h-4 w-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-max">
                    <div className="p-2 max-w-xs">
                      <p className="w-full text-center">
                        Are you sure you want to delete this chat?
                      </p>
                      <div className="flex items-center justify-between mt-10 ">
                        <button
                          aria-label="cancel button"
                          onClick={() => setIsOpen(false)}
                          className="py-2 px-6 text-sm rounded-lg text-white bg-zinc-950 hover:bg-zinc-900 transition"
                        >
                          Cancel
                        </button>
                        <button
                          aria-label="delete button"
                          onClick={() => mutate({ fileId })}
                          className="py-2 px-6 text-sm rounded-lg text-white bg-red-600 hover:bg-red-500 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
        )
      ) : (
        <div className="mx-auto h-full flex items-center">
          <p className="font-medium">No conversations yet.</p>
        </div>
      )}
    </div>
  );
};

export default ConversationFiles;
