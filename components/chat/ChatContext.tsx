"use client";

import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import { Types } from "mongoose";
import React, { createContext, useRef, useState } from "react";
import { toast } from "../ui/use-toast";

type StreamResponse = {
  addMessage: () => void;
  message: string;
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  isLoading: boolean;
};

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: "",
  handleInputChange: () => {},
  isLoading: false,
});

export default function ChatContextProvider({
  children,
  fileId,
}: {
  children: React.ReactNode;
  fileId: string;
}) {
  const [message, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = trpc.useUtils();
  const backupMessage = useRef("");

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({
      fileId,
      message,
    }: {
      fileId: string;
      message: string;
    }) => {
      const resp = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!resp.ok) {
        throw new Error("failed to send message");
      }

      return resp.body;
    },
    onMutate: async ({ fileId, message }) => {
      backupMessage.current = message;
      setMessage("");
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await utils.getFileMessages.cancel();

      // Snapshot the previous value
      const previousMessages = utils.getFileMessages.getInfiniteData();

      // Optimistically update to the new value
      utils.getFileMessages.setInfiniteData(
        { fileId, limit: INFINITE_QUERY_LIMIT },
        (old) => {
          if (!old)
            return {
              pages: [],
              pageParams: [],
            };

          let prevPages = [...old.pages];
          let curMessages = prevPages[0];

          curMessages.messages = [
            {
              _id: new Types.ObjectId().toString(),
              content: message,
              isUserMessage: true,
              createdAt: new Date().toISOString(),
            },
            ...curMessages.messages,
          ];

          prevPages[0] = curMessages;

          return {
            ...old,
            pages: prevPages,
          };
        }
      );

      setIsLoading(true);
      // Return a context object with the snapshotted value
      return {
        previousMessages:
          previousMessages?.pages.flatMap((page) => page.messages) ?? [],
      };
    },
    onSuccess: async (stream) => {
      setIsLoading(false);
      if (!stream) {
        return toast({
          title: "There was a problem while sending message.",
          description: "Please refresh this page and try again",
          variant: "destructive",
        });
      }

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let accuResponse = "";
      while (!done) {
        const { value, done: doneReading } = await reader.read();
        const chunk = decoder.decode(value);
        accuResponse += chunk;
        done = doneReading;

        utils.getFileMessages.setInfiniteData(
          { fileId, limit: INFINITE_QUERY_LIMIT },
          (old) => {
            if (!old) return { pages: [], pageParams: [] };

            const _id = "ai-response";
            let isAiResponse = old.pages.some((page) =>
              page.messages.some((msg) => msg._id.toString() === _id)
            );

            let updatedPages = old.pages.map((page) => {
              if (page === old.pages[0]) {
                let updatedMessages = [];

                if (!isAiResponse) {
                  updatedMessages = [
                    {
                      _id,
                      content: accuResponse,
                      isUserMessage: false,
                      createdAt: new Date().toISOString(),
                    },
                    ...page.messages,
                  ];
                } else {
                  updatedMessages = page.messages.map((msg) => {
                    if (msg._id.toString() === _id) {
                      return {
                        ...msg,
                        content: accuResponse,
                      };
                    }
                    return msg;
                  });
                }

                return {
                  ...page,
                  messages: updatedMessages,
                };
              }

              return page;
            });

            return {
              ...old,
              pages: updatedPages,
            };
          }
        );
      }
    },
    onError: (_, __, context) => {
      setMessage(backupMessage.current);
      utils.getFileMessages.setData(
        { fileId },
        { messages: context?.previousMessages ?? [] }
      );
    },
    onSettled: async () => {
      setIsLoading(false);
      await utils.getFileMessages.invalidate({ fileId });
    },
  });

  const addMessage = () => sendMessage({ fileId, message });

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        handleInputChange,
        isLoading,
        message,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
