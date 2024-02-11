"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { UserRound, Wand2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { format } from "date-fns";

const Icons = {
  user: UserRound,
  logo: Wand2,
};

type MessageProps = {
  message: {
    _id: string;
    content: string | JSX.Element;
    isUserMessage: boolean;
    createdAt: string;
  };
};

const Message = forwardRef<HTMLDivElement, MessageProps>(({ message }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex items-end ", {
        "justify-end": message.isUserMessage,
      })}
    >
      <div
        className={cn("self-start w-6 aspect-square mt-1", {
          "order-2 rounded-sm": message.isUserMessage,
          "order-1 rounded-sm": !message.isUserMessage,
        })}
      >
        {message.isUserMessage ? (
          <Icons.user className="h-3/4 w-3/4" />
        ) : (
          <Icons.logo className="h-3/4 w-3/4" />
        )}
      </div>

      <div
        className={cn("text-base max-w-md md:max-w-sm mx-2 space-y-2", {
          "order-1": message.isUserMessage,
          "text-gray-900 order-2": !message.isUserMessage,
        })}
      >
        {typeof message.content === "string" ? (
          <ReactMarkdown
            className={cn(
              "prose px-4 py-2 text-base md:text-sm shadow rounded-lg leading-relaxed",
              {
                "bg-yellow-400": message.isUserMessage,
                "bg-white": !message.isUserMessage,
              }
            )}
          >
            {message.content}
          </ReactMarkdown>
        ) : (
          message.content
        )}
        {message._id.toString() !== "loading-message" ? (
          <div
            className={cn("text-xs select-none w-full", {
              "text-zinc-950": !message.isUserMessage,
              "text-yellow-600 text-right": message.isUserMessage,
            })}
          >
            {format(message.createdAt, "dd/MM/yyyy - HH:mm")}
          </div>
        ) : null}
      </div>
    </div>
  );
});

Message.displayName = "Message";

export default Message;
