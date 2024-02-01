"use client";

import { FileType } from "@/lib/models/models";
import { cn } from "@/lib/utils";
import { File } from "lucide-react";
import Link from "next/link";

type UploadedFileItemProps = Omit<
  FileType,
  "user" | "_id" | "createdAt" | "updatedAt"
> & {
  user: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
};

const UploadedFileItem = ({
  file,
  fileId,
}: {
  file: UploadedFileItemProps;
  fileId: string;
}) => {
  const sizeInMB = (file.size / 1024 / 1024).toFixed(2);

  return (
    <button
      type="button"
      className={cn(
        `flex justify-between w-full items-center hover:bg-zinc-100 p-2 rounded-lg transition cursor-pointer`,
        fileId === file._id ? "bg-zinc-100" : ""
      )}
    >
      <div className="flex gap-2 items-center">
        <File className="w-5 h-5 md:w-6 md:h-6" />
        <p
          className="font-medium text-sm overflow-hidden text-nowrap text-ellipsis max-w-44"
          title={file.name}
        >
          {file.name}
        </p>
      </div>
      <p className="text-xs">{sizeInMB}MB</p>
    </button>
  );
};

export default UploadedFileItem;
