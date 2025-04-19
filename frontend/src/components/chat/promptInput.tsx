import React, { useRef, useState, useCallback } from "react";
import { LoaderIcon, Send } from "lucide-react";
import { Button } from "../ui/button";

export default function PromptInput({
  disabled = false,
  generating,
  handleInteractStream,
}: {
  disabled: boolean;
  generating: boolean;
  handleInteractStream: (prompt: string) => void;
}) {
  const [promptMessage, setPromptMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (promptMessage.trim()) {
        handleInteractStream(promptMessage);
        setPromptMessage(""); // Clear input after sending
      }
    },
    [promptMessage, handleInteractStream]
  );

  return (
    <form
      ref={formRef}
      className="flex justify-center w-full mt-2 "
      onSubmit={onSubmit}
    >
      <div
        className={`relative flex items-center w-[90%] max-w-3xl bg-middleground p-2 rounded-full border-transparent bg-primary text-primary-foreground hover:bg-primary/80${
          disabled ? "cursor-not-allowed bg-zinc-300" : ""
        }`}
      >
        <input
          type="text"
          className="w-full bg-transparent border-none px-4 py-2 rounded-full focus:outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          value={promptMessage}
          onChange={(e) => setPromptMessage(e.target.value)}
          aria-disabled={disabled}
           placeholder="Enter your message..."
        />
        <Button
          type="submit"
          variant="default"
          disabled={!promptMessage.trim() || disabled}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer hover:opacity-80 p-2 rounded-full"
        >
          {generating ? <LoaderIcon className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </form>
  );
}
