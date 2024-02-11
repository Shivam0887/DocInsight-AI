"use client";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Loader2, MessageSquare } from "lucide-react";
import Message from "./Message";
import { useContext, useEffect, useRef } from "react";
import { ChatContext } from "./ChatContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useIntersection } from "@mantine/hooks";

const Messages = ({ fileId }: { fileId: string }) => {
  const { isLoading: isAIThinking } = useContext(ChatContext);
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
      }
    );

  const lastMessageRef = useRef<HTMLDivElement>(null);

  const { ref, entry } = useIntersection({
    root: lastMessageRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage]);

  const loadingReplyMsg = {
    createdAt: new Date().toISOString(),
    _id: "loading-message",
    isUserMessage: false,
    content: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const messages = [
    ...(isAIThinking ? [loadingReplyMsg] : []),
    ...(data?.pages.flatMap((page) => page.messages) ?? []),
  ];

  return (
    <div className="h-full flex flex-col-reverse gap-4 overflow-y-auto p-3 pb-0 scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2">
      {messages && messages.length > 0 ? (
        messages.map((message, i) => {
          const isLastMessage = i === messages.length - 1;
          return (
            <Message
              key={message._id.toString()}
              message={message}
              ref={isLastMessage ? ref : null}
            />
          );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2 p-4">
          <Skeleton className="h-4 bg-zinc-200" />
          <Skeleton className="h-4 bg-zinc-200" />
          <Skeleton className="h-4 bg-zinc-200" />
          <Skeleton className="h-4 w-3/4 bg-zinc-200" />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2">
          <MessageSquare className="h-8 w-8 text-yell-500" />
          <h3 className="font-semibold text-xl">You&apos;re all set!</h3>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};

export default Messages;
