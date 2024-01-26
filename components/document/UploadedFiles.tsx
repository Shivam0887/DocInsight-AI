"use client";

import { trpc } from "@/app/_trpc/client";

const UploadedFiles = () => {
  const { data, isPending } = trpc.getFiles.useQuery({});
  return <div>UploadedFiles</div>;
};

export default UploadedFiles;
