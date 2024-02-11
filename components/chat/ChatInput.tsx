"use client";

import React, { useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button, buttonVariants } from "../ui/button";
import { Send } from "lucide-react";
import { useContext } from "react";
import { ChatContext } from "@/components/chat/ChatContext";

const ChatInput = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form
      className="py-2 px-1 max-w-full flex gap-3 m-2"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="relative w-full">
        <Textarea
          ref={textareaRef}
          rows={1}
          maxRows={4}
          value={message}
          placeholder="Enter your question..."
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              addMessage();
              textareaRef.current?.focus();
            }
          }}
          className="resize-none pr-12 text-base py-3 scrollbar-thumb-rounded scrollbar-thumb-blue scrollbar-track-blue-lighter scrollbar-w-2"
        />
        <Button
          aria-label="send message"
          disabled={isLoading || isDisabled}
          onClick={() => {
            addMessage();
            textareaRef.current?.focus();
          }}
          type="submit"
          className={buttonVariants({
            size: "sm",
            className: "absolute bottom-1.5 right-2",
          })}
        >
          <Send className="w-3 h-3" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
