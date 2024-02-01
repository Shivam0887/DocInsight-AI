"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Expand, Loader2, Shrink } from "lucide-react";
import { Button } from "../ui/button";
import SimpleBar from "simplebar-react";
import { Document, Page } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

const PdfFullscreen = ({ url }: { url: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [numPages, setNumPages] = useState<number>(1);
  const [onError, setOnError] = useState<Error>();

  const { ref, width } = useResizeDetector();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button aria-label="full screen" variant="ghost">
          <Expand className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl w-full">
        <SimpleBar
          autoHide={false}
          forceVisible="x"
          className="max-h-[calc(100vh-10rem)] mt-6"
        >
          <div ref={ref} className="h-full">
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              error={
                <div className="max-w-max mx-auto mt-6">
                  <p className="text-red-600 mx-auto">{onError?.message}</p>
                </div>
              }
              onLoadError={(error) => setOnError(error)}
              onSourceError={(error) => setOnError(error)}
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page key={i} width={width ?? 1} pageNumber={i + 1} />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
