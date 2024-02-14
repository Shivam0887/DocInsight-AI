"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import UploadFile from "../fileUpload/UploadFile";

const UploadFileModal = ({
  children: trigger,
  isSubscribed,
  onlyDropdown,
}: {
  children: React.ReactNode;
  isSubscribed: boolean;
  onlyDropdown?: boolean;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <></>;

  return (
    <Dialog>
      <DialogTrigger asChild className="cursor-pointer">
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-max sm:max-w-[600px] rounded-xl">
        <UploadFile onlyDropdown={onlyDropdown} isSubscribed={isSubscribed} />
      </DialogContent>
    </Dialog>
  );
};

export default UploadFileModal;
