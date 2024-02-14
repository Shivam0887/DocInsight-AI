"use client";

import { trpc } from "@/app/_trpc/client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const DocDeletePage = () => {
  const { toast } = useToast();
  const { mutate } = trpc.deleteFile.useMutation({
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "please provide correct document Id",
        variant: "destructive",
      });
    },
  });
  const [docId, setDocId] = useState("");

  return (
    <MaxWidthWrapper className="bg-white rounded-2xl mt-20 py-10 sm:py-20 max-w-5xl">
      <div className="two_col_flexbox justify-between gap-4">
        <h3 className="text-xl sm:text-3xl font-bold">Delete document</h3>
        <p className="max-w-sm text-sm">
          You&apos;ll be able to delete any document you no longer want on this
          dashboard. Just input the <strong>Doc ID</strong> and delete the
          document.
        </p>
      </div>
      <div className="h-[1px] bg-zinc-200 mt-10 mb-10 sm:mb-20" />
      <div className="two_col_flexbox gap-3">
        <input
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          type="text"
          placeholder="Input Doc Id"
          className="rounded-lg border border-zinc-200 p-2 flex-1"
        />
        <button
          onClick={() => mutate({ docId })}
          type="button"
          aria-label="delete button"
          className="text-sm font-semibold text-white w-max bg-zinc-950 rounded-lg py-3 px-6 sm:px-10 hover:bg-zinc-900 transition"
        >
          Delete
        </button>
      </div>
    </MaxWidthWrapper>
  );
};

export default DocDeletePage;
