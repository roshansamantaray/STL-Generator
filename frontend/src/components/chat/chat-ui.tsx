import { ScrollArea } from "@radix-ui/react-scroll-area";
import React, { useEffect, useRef } from "react";
import Message from "./message";
import { MessageMarkdown } from "../messages/message-markdown";
export interface MessageNew {
  id: string;
  request?: string;
  response?: string;
  status: "INPROGRESS" | "FAILED" | "SUCCESS";
  prompt_title?: string;
}

const ChatUI = ({
  messages,
  tempMessage,
  name
}: {
  messages: Record<string, MessageNew>;
  tempMessage: string;
  name: string;
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages, tempMessage]);

  const hasAskedQuestion = Object.keys(messages).length > 0 || !!tempMessage;

  return (
    <ScrollArea className="flex-1">
      <div className="container mx-auto px-4">
        {/* Conditionally show "Start asking questions" prompt if no questions/messages are present */}
        {!hasAskedQuestion && (
          //<p className="text-center">Start asking questions.</p>
          <Message key={1} message={{id:"1", status:"SUCCESS" , request:"Start asking questions"}} name={name} />
        )}

        {Object.values(messages).map((msg, i) => (
          <Message key={i} message={msg} name={name} />
        ))}

        {/* {tempMessage && <MessageMarkdown content={tempMessage} />} */}

      </div>
      <div ref={scrollRef} className="h-16" />
    </ScrollArea>
  );
};

export default ChatUI;
