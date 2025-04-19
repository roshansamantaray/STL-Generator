import React, { useState } from "react";
import PromptInput from "./promptInput";

import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

// import { Prompt } from "@/types/bots";
import PromptDialogue from "./prompt-dialogue";



const ChatInput = ({
  // prompts,
  allow_free_chat,
  isLoading,
  handleInteractStream,
}: {
  // prompts: Prompt[];
  allow_free_chat: boolean;
  isLoading: boolean;
  handleInteractStream: (prompt: string, prompt_title?: string) => void;
}) => {
  

  return (
    <div className="flex items-center">

      <div className="w-full flex flex-col items-center justify-center">
        <ScrollArea className="w-full overflow-x-auto items-center">
          <div className="flex justify-center items-center gap-4 mr-5 ml-3">
            {/* {prompts && prompts.length > 0
              ? prompts.map((prompt, index) => (
                  <Badge
                    key={index}
                    onClick={() =>
                      promptSubmitHandler(prompt.prompt, prompt.title)
                    }
                    className={`text-md cursor-pointer px-4 ${
                      isLoading
                        ? "text-secondary-foreground pointer-events-none"
                        : "text-primary pointer-events-auto"
                    } inline-flex items-center whitespace-nowrap overflow-hidden text-ellipsis`}
                    variant={isLoading ? "secondary" : "outline"}
                  >
                    {prompt.title}
                  </Badge>
                ))
              : null} */}
          </div>
          <ScrollBar orientation="horizontal" className="h-1.25" />
        </ScrollArea>

        {allow_free_chat && (
          <div className="w-full flex justify-center mx-2">
            <PromptInput
              disabled={false}
              generating={isLoading}
              handleInteractStream={handleInteractStream}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInput;
