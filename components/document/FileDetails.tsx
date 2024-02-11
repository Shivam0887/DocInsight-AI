"use client";

import { trpc } from "@/app/_trpc/client";
import {
  CheckCircle,
  Copy,
  File,
  Loader2,
  MessageSquare,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";

const Month = [
  "January",
  "Fabruary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "Novermber",
  "December",
] as const;

const FileDetails = ({ fileId }: { fileId: string }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isPending } = trpc.getFile.useQuery({ fileId });
  const [isCopied, setIsCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [docId, setDocId] = useState("");
  const { mutate, isError, error } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [["getFiles"], { type: "query" }],
      });
      localStorage.setItem("modalClose", "false");
      setIsOpen(false);
      setTimeout(() => {
        router.push("/conversations");
      }, 500);
    },
  });

  const handleClick = async () => {
    await window.navigator.clipboard.writeText(data?.docId as string);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  let uploadDate = "";
  if (data) {
    const date = new Date(data.createdAt);
    uploadDate = `${
      Month[date.getMonth()]
    } ${date.getDate()}, ${date.getFullYear()}`;
  }

  if (isError) {
    console.log(error.message);
  }

  return (
    <>
      <div className="py-6 px-4 h-full w-full">
        {isPending ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto mt-10" />
        ) : (
          <div className="flex flex-col justify-between items-center h-full">
            <div>
              <div className="flex gap-4 -ml-1">
                <File className="w-8 h-8" />
                <h1 className="text-xl font-semibold">{data?.name}</h1>
              </div>
              <div className="flex gap-1 mt-6 items-center">
                <p className="font-medium text-base">
                  ID: <span className="font-normal">{data?.docId}</span>
                </p>
                {isCopied ? (
                  <CheckCircle className="w-6 h-6 stroke-emerald-600" />
                ) : (
                  <Copy
                    className="w-6 h-6 cursor-pointer stroke-yellow-600 rotate-90"
                    onClick={handleClick}
                  />
                )}
              </div>
              <p className="mt-4 font-medium text-base">
                Uploaded: <span className="font-normal">{uploadDate}</span>
              </p>
              <p className="mt-4 font-medium text-base">
                Pages: <span className="font-normal">{data?.pages}</span>
              </p>

              {/* after chatting with document */}
              <p className="mt-4">Document overview</p>
            </div>

            <div className="flex w-full gap-2 mt-6 max-w-80">
              <Link
                href={`/conversations/${data?._id}`}
                className="flex grow gap-3 items-center justify-center bg-zinc-950 text-white rounded-lg hover:bg-zinc-900 transition py-3 px-4 "
              >
                <MessageSquare className="h-4 w-4" />
                <p className="font-medium text-sm">new chat</p>
              </Link>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <div className="flex grow gap-3 items-center justify-center bg-red-500 text-white rounded-lg hover:bg-red-400 transition py-3 px-6 cursor-pointer">
                    <Trash className="stroke-white h-4 w-4" />
                    <p className="mt-1 text-sm">Delete</p>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <div className="flex flex-col items-center py-2 px-4 gap-2">
                    <h3 className="font-semibold text-xl">Delete Document</h3>
                    <p className="text-center text-sm">
                      Are you sure you want to delete this document? The
                      associated conversation will be deleted from our servers
                      as well.
                    </p>

                    <input
                      type="text"
                      placeholder="enter document id"
                      value={docId}
                      onChange={(e) => setDocId(e.target.value)}
                      className="outline-none text-sm border-2 w-full my-2 p-2 rounded-lg capitalize"
                    />
                    <div className="w-full flex justify-evenly">
                      <DialogClose className="text-sm bg-zinc-950 text-white rounded-lg hover:bg-zinc-900 transition py-3 px-4">
                        Go back
                      </DialogClose>
                      <button
                        type="button"
                        onClick={() => mutate({ docId, fileId })}
                        className="text-sm bg-red-500 text-white rounded-lg hover:bg-red-400 transition py-3 px-4"
                      >
                        Delete
                      </button>
                    </div>
                    {isError && (
                      <p className="mt-4 lowercase text-red-500">
                        {error.message}
                      </p>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default FileDetails;
