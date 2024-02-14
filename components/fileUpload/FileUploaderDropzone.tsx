"use client";

import { useState } from "react";

import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";

import { useUploadThing } from "@/lib/uploadthing";
import { UploadCloud } from "lucide-react";

type FileUploaderProps = {
  setProgress: (p: number) => void;
  setFileName: (f: string) => void;
  setFileInfo: (info: { fileId: string }) => void;
  isSubscribed: boolean;
};

export function FileUploaderDropzone({
  setFileName,
  setProgress,
  setFileInfo,
  isSubscribed,
}: FileUploaderProps) {
  const [isDropped, setIsDropped] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    isSubscribed ? "proPlanFileUploader" : "freePlanFileUploader",
    {
      onClientUploadComplete(res) {
        setFileInfo({ fileId: res?.[0].serverData?.fileId ?? "" });
      },
      onUploadError: (error) => {
        console.log(error.message);
      },
      onUploadProgress: (progress) => {
        setProgress(progress);
      },
    }
  );

  const onDrop = async (acceptedFiles: File[]) => {
    setIsDropped(true);
    setFiles(acceptedFiles);
    if (acceptedFiles.length) {
      setFileName(acceptedFiles[0].name);
      await startUpload(acceptedFiles);
    }
  };

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
    multiple: false,
  });

  return (
    <>
      <div
        {...getRootProps()}
        className="border-[2px] p-3 mt-4 border-dashed cursor-pointer flex flex-col items-center justify-center rounded-lg"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2.5 p-2">
          <UploadCloud className="stroke-gray-600 bg-zinc-100 w-9 h-9 p-1.5 rounded-full ring-[7px] ring-zinc-50" />

          <p className="text-zinc-400 font-normal text-xs sm:text-sm">
            <span className="text-black font-medium">Click to upload</span> or
            drag and drop
          </p>

          <p className="text-zinc-400 text-[10px] sm:text-xs">
            Maxsize: {isSubscribed ? 16 : 4}MB
          </p>
        </div>
      </div>
      {isDropped && !files.length && (
        <p className="text-red-600 mt-4 text-sm text-center">
          Invalid File Format
        </p>
      )}
    </>
  );
}
