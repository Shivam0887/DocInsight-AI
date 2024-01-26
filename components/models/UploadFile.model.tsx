"use client";

import { Upload } from "lucide-react";
import React, { useEffect, useState } from "react";
import { trpc } from "@/app/_trpc/client";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import UploadFile from "@/components/fileUpload/UploadFile";

const UploadFileModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="select-none mt-8 flex text-sm items-center p-3.5 rounded-lg text-black
           bg-yellow-500 hover:bg-yellow-400 transition gap-2 font-semibold cursor-pointer"
        >
          <Upload className="w-5 h-5" />
          <p>Upload Document</p>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-max sm:max-w-[600px] rounded-xl">
        <UploadFile className="p-2 sm:p-6" />
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileModal;
