"use client";

import Link from "next/link";
import MaxWidthWrapper from "./MaxWidthWrapper";
import { MessageSquare } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { trpc } from "@/app/_trpc/client";

const Description = () => {
  const [isRedirecting, setIsRedirecting] = useState<boolean | undefined>(
    false
  );
  const { data } = trpc.getFiles.useQuery();

  useEffect(() => {
    setIsRedirecting(!data?.length);
  }, [data]);

  return (
    <MaxWidthWrapper className="pt-14">
      <div className="bg-white mx-auto md:w-full md:max-w-none max-w-max rounded-xl two_col_flexbox items-center md:justify-between gap-y-8 md:p-10 p-6">
        <div className="two_col_flexbox items-center md:gap-x-4 gap-y-4">
          <MessageSquare className="w-16 h-16" />
          <div className="max-w-[350px]">
            <h3 className="text-center lg:text-left text-xl lg:text-2xl font-semibold">
              Start your first conversation
            </h3>
            <p className="text-center lg:text-left text-xs text-zinc-400 mt-2 leading-relaxed">
              Begin a conversation with me by uploading a document. I&apos;ll
              respond with anything you need based on the document
            </p>
          </div>
        </div>
        <Link
          href={`/file-upload?new=${isRedirecting}`}
          className="md:ml-5 text-center text-xs md:text-sm font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-xl py-3 md:py-4 px-6 md:px-10 transition"
        >
          Start Conversation
        </Link>
      </div>

      <div className="bg-white rounded-lg p-4 mt-28 max-w-[768px] mx-auto">
        <p className="text-yellow-600 text-xl font-semibold my-5 mx-auto w-max underline">
          FAQs
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="text-sm">
            <AccordionTrigger>What is this application about?</AccordionTrigger>
            <AccordionContent>
              This application lets you chat with any document you upload.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="text-sm">
            <AccordionTrigger>How does it work?</AccordionTrigger>
            <AccordionContent>
              The application uses artificial intelligence to analyze the
              content of the document and provide a chat interface for users to
              ask questions get answers.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="text-sm">
            <AccordionTrigger>Can I upload any document?</AccordionTrigger>
            <AccordionContent>
              We support only two document formats (&apos;.pdf&apos;,
              &apos;.txt&apos;)
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4" className="text-sm">
            <AccordionTrigger>
              Is it necessary to create an account to use the application?
            </AccordionTrigger>
            <AccordionContent>
              Yes, you need to create an account to use the application.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MaxWidthWrapper>
  );
};

export default Description;
