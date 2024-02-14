"use client";

import { useState } from "react";
import ConversationFiles from "./ConversationFiles";
import UploadedFiles from "./UploadedFiles";
import Link from "next/link";
import { cn } from "@/lib/utils";

const UserFiles = ({ className }: { className?: string }) => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className={cn("p-6 bg-white sm:w-80", className)}>
      <div className="flex gap-5 justify-center rounded-xl bg-zinc-100 h-12">
        <button
          type="button"
          onClick={() => setIsSelected(false)}
          className={`${
            isSelected
              ? "text-zinc-400"
              : "text-zinc-950 bg-white rounded-lg shadow-lg"
          } text-xs py-2 px-4 ml-1 my-1 flex-1 flex-shrink-0 font-medium`}
        >
          Conversations
        </button>
        <button
          type="button"
          onClick={() => setIsSelected(true)}
          className={`${
            isSelected
              ? "text-zinc-950 bg-white rounded-lg shadow-lg"
              : "text-zinc-400"
          } text-xs py-2 px-4 mr-1 my-1 flex-1 flex-shrink-0 font-medium`}
        >
          Documents
        </button>
      </div>
      <Link
        href="/file-upload?new=true"
        className="w-full block my-4 text-center rounded-lg p-3 text-white text-sm bg-zinc-950 hover:bg-zinc-900 transition"
      >
        +New Conversation
      </Link>
      {isSelected ? <UploadedFiles /> : <ConversationFiles />}
    </div>
  );
};

export default UserFiles;
