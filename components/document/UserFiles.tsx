"use client";

import { useState } from "react";
import ConversationFiles from "./ConversationFiles";
import UploadedFiles from "./UploadedFiles";

const UserFiles = () => {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <div className="my-6 mx-4 rounded-2xl bg-white w-80 p-4 shadow-md">
      <div className="flex gap-5 justify-center rounded-xl bg-zinc-100 h-12">
        <button
          type="button"
          onClick={() => setIsSelected(false)}
          className={`${
            isSelected
              ? "text-zinc-400"
              : "text-zinc-950 bg-white rounded-lg shadow-lg"
          } text-xs py-2 px-4 ml-1 my-1 flex-1 font-medium`}
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
          } text-xs py-2 px-4 mr-1 my-1 flex-1 font-medium`}
        >
          Documents
        </button>
      </div>
      {isSelected ? <UploadedFiles /> : <ConversationFiles />}
    </div>
  );
};

export default UserFiles;
