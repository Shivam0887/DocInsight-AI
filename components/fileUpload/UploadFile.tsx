"use client";

import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FileUploaderDropzone } from "./FileUploaderDropzone";
import { Progress } from "@/components/ui/progress";
import { File, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import UrlFileUpload from "./UrlFileUpload";

const UploadFile = ({
  className,
  isSubscribed,
  onlyDropdown,
}: {
  className?: string;
  isSubscribed: boolean;
  onlyDropdown?: boolean;
}) => {
  const [isSelect, setIsSelect] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string>("");
  const [fileInfo, setFileInfo] = useState<{ fileId: string }>({
    fileId: "",
  });

  const router = useRouter();
  if (fileInfo.fileId) {
    setTimeout(() => {
      router.push(`/conversations/${fileInfo.fileId}`);
    }, 100);
  }

  return (
    <div className={cn("w-full py-12 px-5 xs:px-6 sm:px-[72px]", className)}>
      <div className="rounded-3xl bg-zinc-100 max-w-max p-1 flex gap-4">
        <button
          className={`py-3 px-4 ${
            isSelect
              ? "text-zinc-500"
              : "bg-white rounded-[20px] text-black shadow-md"
          } text-xs capitalize font-semibold`}
          onClick={() => setIsSelect(false)}
        >
          upload document
        </button>
        {!onlyDropdown && (
          <button
            className={`py-3 px-4 ${
              isSelect
                ? "bg-white rounded-[20px] shadow-md text-black"
                : "text-zinc-500"
            } text-xs capitalize font-semibold`}
            onClick={() => setIsSelect(true)}
          >
            upload from <span className="uppercase">url</span>
          </button>
        )}
      </div>
      <div>
        {!fileName ? (
          isSelect && !onlyDropdown ? (
            // Upload the file using file url
            <UrlFileUpload setFileInfo={setFileInfo} />
          ) : (
            <FileUploaderDropzone
              setProgress={setProgress}
              setFileName={setFileName}
              setFileInfo={setFileInfo}
              isSubscribed={isSubscribed}
            />
          )
        ) : (
          <div className="mt-5">
            <div className="flex mb-2">
              <File className="w-6 h-6 sm:w-8 sm:h-8" />
              <p className="text-xl font-medium ml-2">{fileName}</p>
            </div>
            <div className="flex w-full items-center">
              <Progress
                value={progress}
                className="w-[90%] h-1"
                progressColor={progress === 100 ? "bg-green-500" : ""}
              />
              <p className="ml-2 text-sm">{progress}%</p>
            </div>
          </div>
        )}

        {fileInfo.fileId && (
          <div className="flex mt-4 items-center justify-center gap-2">
            <Loader className="w-4 h-5 animate-spin" />
            <span className="text-xs">Redirecting</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadFile;
