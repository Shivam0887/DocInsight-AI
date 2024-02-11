"use client";

import { z } from "zod";
import React, { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Loader2,
  RotateCw,
  ZoomIn,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import PdfFullscreen from "./PdfFullscreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type DocumentRendererProps = {
  url: string;
};

const DocumentRenderer = ({ url }: DocumentRendererProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMounted, setIsMounded] = useState(false);

  const [numPages, setNumPages] = useState<number>(1);
  const [prevPage, setPrevPage] = useState<number>(1);
  const [curPage, setCurPage] = useState<number>(1);
  const [onError, setOnError] = useState<Error>();

  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);
  const [scale, setScale] = useState<number>(1);

  const isLoading = renderedScale !== scale;

  const {
    ref,
    width: wrapperWidth,
    height: wrapperHeight,
  } = useResizeDetector();

  const PageValidatorSchema = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages),
  });

  type TPageValidator = z.infer<typeof PageValidatorSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TPageValidator>({
    resolver: zodResolver(PageValidatorSchema),
    defaultValues: {
      page: "1",
    },
  });

  useEffect(() => {
    setIsMounded(true);
  }, []);

  const handlePageSubmit = ({ page }: TPageValidator) => {
    setCurPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <>
      {isMounted && (
        <div className="flex flex-col items-center">
          <div
            className={cn(
              "mb-4 w-full self-start bg-white rounded-md shadow flex flex-col items-center  transition-transform duration-300",
              isOpen
                ? "lg:translate-y-[0%]"
                : "hidden lg:flex -translate-y-[100%] lg:translate-y-[0%]"
            )}
          >
            {/* top-bar */}
            <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
              {/* pdf navigation */}
              <div className="flex items-center gap-1.5">
                <button
                  disabled={curPage <= 1}
                  type="button"
                  aria-label="previous page"
                  className="hover:bg-zinc-100 rounded-md p-1"
                  onClick={() => {
                    setPrevPage(curPage);
                    setCurPage((prev) => (prev - 1 > 0 ? prev - 1 : 1));
                    setValue("page", String(curPage - 1));
                  }}
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5">
                  <input
                    {...register("page")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(handlePageSubmit)();
                      }
                    }}
                    type="text"
                    className={cn(
                      "w-12 h-8 text-center text-xs rounded-md border-2 border-zinc-100 outline-yellow-500",
                      errors.page && "outline-red-500"
                    )}
                  />
                  <span>/</span>
                  <span>{numPages ?? "x"}</span>
                </div>

                <button
                  disabled={curPage >= numPages}
                  type="button"
                  aria-label="next page"
                  className="hover:bg-zinc-100 rounded-md p-1"
                  onClick={() => {
                    setPrevPage(curPage);
                    setCurPage((prev) =>
                      prev + 1 <= numPages ? prev + 1 : numPages
                    );
                    setValue("page", String(curPage + 1));
                  }}
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
              </div>

              {/* pdf-zoom */}
              <div className="space-x-1 flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      aria-label="zoom"
                      className="gap-1.5 flex items-center"
                    >
                      <ZoomIn className="w-4 h-4" />
                      {scale * 100}%
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => setScale(0.5)}>
                      50%
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setScale(1)}>
                      100%
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setScale(1.5)}>
                      150%
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setScale(1.75)}>
                      175%
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setScale(2)}>
                      200%
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* rotation */}
                <Button
                  aria-label="rotate 90 degrees"
                  variant="ghost"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>

                {/* Full-screen */}
                <PdfFullscreen url={url} />
              </div>
            </div>

            {/* pdf renderer */}
            <div className="flex-1 w-full max-h-[80vh] overflow-y-scroll scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2">
              <SimpleBar
                autoHide={false}
                forceVisible="x"
                className="h-full overflow-y-hidden"
              >
                <div ref={ref} className="h-full">
                  <Document
                    file={url}
                    onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                    loading={
                      <div className="flex justify-center h-full">
                        <Loader2 className="my-24 h-6 w-6 animate-spin" />
                      </div>
                    }
                    error={
                      <div className="max-w-max mx-auto mt-6">
                        <p className="text-red-600 mx-auto">
                          {onError?.message}
                        </p>
                      </div>
                    }
                    onLoadError={(error) => setOnError(error)}
                    onSourceError={(error) => setOnError(error)}
                  >
                    {isLoading && renderedScale ? (
                      <Page
                        pageNumber={curPage}
                        width={wrapperWidth ?? 300}
                        scale={renderedScale}
                        rotate={rotation}
                        key={"@" + renderedScale}
                      />
                    ) : null}

                    <Page
                      className={cn(isLoading ? "hidden" : "")}
                      pageNumber={curPage}
                      width={wrapperWidth ?? 300}
                      scale={scale}
                      key={"@" + scale}
                      rotate={rotation}
                      loading={
                        <div className="flex justify-center">
                          <Loader2 className="w-4 h-5 mt-42 animate-spin" />
                        </div>
                      }
                      onRenderSuccess={() => setRenderedScale(scale)}
                    />
                  </Document>
                </div>
              </SimpleBar>
            </div>
          </div>

          {/* collapsable component */}
          <button
            type="button"
            className="lg:hidden mb-1"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            {isOpen ? <ChevronsUp /> : <ChevronsDown />}
          </button>
        </div>
      )}
    </>
  );
};

export default DocumentRenderer;
