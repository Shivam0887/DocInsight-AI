"use client";

import React from "react";
import { trpc } from "@/app/_trpc/client";
import { Loader2 } from "lucide-react";
import UploadedFileItem from "./UploadedFileItem";
import { useParams } from "next/navigation";
import Slider from "../Slider";
import FileDetails from "./FileDetails";

const UploadedFiles = () => {
  const { data, isPending, isError, error } = trpc.getFiles.useQuery();
  const params = useParams();

  if (isError) {
    console.log(error.message);
  }

  return (
    <div>
      {isPending ? (
        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
      ) : (
        <div className="flex flex-col gap-4 overflow-y-auto">
          {data?.map((file) => (
            <React.Fragment key={file.docId}>
              <Slider
                triggerClassName="min-h-max"
                side="left"
                triggerElement={
                  <UploadedFileItem file={file} fileId={params.id as string} />
                }
              >
                <FileDetails fileId={file._id.toString()} />
              </Slider>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadedFiles;
