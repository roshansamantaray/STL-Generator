import { Bot } from "lucide-react";
import React from "react";

//Components
import LoadingDots from "@/components/loading-dots";

import { MessageMarkdown } from "../messages/message-markdown";
import { MessageNew } from "@/_stores/useStreamStore";

function Message({ message, name }: { message: MessageNew; name: string }) {
  const { request, response, status, prompt_title } = message;

  return (
    <div className=" text-primary   p-6 ">
      {request ? (
        <div className="flex  gap-2  mb-4 items-center ">
          <div className="flex  gap-2 ">
            <h1 className="font-semibold text-center text-lg">Action :</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-primary  ">{prompt_title || request}</div>
          </div>
        </div>
      ) : null}

      {status == "INPROGRESS" ? (
        <>
          <div className="flex gap-2 mb-2 items-center">
            <Bot />
            <h1 className="font-semibold text-center text-lg ">{name} :</h1>
            <div className="flex gap-2">
              <LoadingDots />
            </div>
          </div>
        </>
      ) : status == "FAILED" ? (
        <>
          <div className="flex gap-2 mb-2 items-center">
            <Bot />
            <h1 className="font-semibold text-center text-lg ">{name} :</h1>
            <div className="border-red-600 border-2 h-10 flex  items-center justify-center bg-red-600 bg-opacity-35 p-2 rounded-md">
              <h1 className="text-center">Network error</h1>
            </div>
          </div>
        </>
      ) : response ? (
        <>
          <div className="flex gap-2 mb-2">
            <div className="flex  justify-between w-full items-center">
              <div className="flex gap-2">
                <Bot />
                <h1 className="font-semibold text-center text-lg ">{name} :</h1>
              </div>
            </div>
          </div>
          <div className="mb-4 p-3  rounded-md shadow-sm">
            <MessageMarkdown content={response} />
          </div>
          <div></div>
        </>
      ) : null}
    </div>
  );
}

export default Message;
