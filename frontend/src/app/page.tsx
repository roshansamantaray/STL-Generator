"use client";

import ChatInput from "@/components/chat/chat-input";
import ChatUI, { MessageNew } from "@/components/chat/chat-ui";

import React, { useEffect, useState } from "react";
import { AlignLeft, X } from "lucide-react";
import { ManagerSidebar } from "@/components/chat/ManagerSidebar";

const PublicChat = () => {

  const chatData = [
    {
      id: 1,
      bot_id: 101,
      open_chat: true,
      allow_public_upload: false,
      bots: {
        id: 101,
        name: "Customer Support Bot",
        version: "1.0",
      },
      document: [
        {
          id: 1,
          path: "/documents/user-guide.pdf",
          name: "User Guide",
        },
        {
          id: 2,
          path: "/documents/privacy-policy.pdf",
          name: "Privacy Policy",
        },
      ],
    },
    {
      id: 2,
      bot_id: 102,
      open_chat: false,
      allow_public_upload: true,
      bots: {
        id: 102,
        name: "Onboarding Assistant Bot",
        version: "2.1",
      },
      document: [
        {
          id: 3,
          path: "/documents/welcome-guide.pdf",
          name: "Welcome Guide",
        },
        {
          id: 4,
          path: "/documents/faq.pdf",
          name: "FAQ Document",
        },
        {
          id: 5,
          path: "/documents/terms-and-conditions.pdf",
          name: "Terms and Conditions",
        },
      ],
    },
  ];
  const chatId = 1;
  const messages: Record<string, MessageNew> = {
    "1": {
      id: "1",
      request: "What is the weather like today?",
      response: "The weather is sunny with a high of 25°C.",
      status: "SUCCESS",
      prompt_title: "Weather Inquiry",
    },
    "2": {
      id: "2",
      request: "Translate 'Hello' to French",
      response: "Bonjour",
      status: "SUCCESS",
      prompt_title: "Translation",
    },
    "3": {
      id: "3",
      request: "Book a flight to New York",
      response: "Failed to process your request. Please try again later.",
      status: "FAILED",
      prompt_title: "Flight Booking",
    },
    "4": {
      id: "4",
      request: "Summarize the article on climate change",
      status: "INPROGRESS",
      prompt_title: "Summarization Task",
    },
    "5": {
      id: "5",
      request: "Generate an image of a futuristic cityscape",
      response: "Image generated successfully and saved to /images/cityscape.png",
      status: "SUCCESS",
      prompt_title: "Image Generation",
    },
  };
  // State for toggling the file manager sidebar
  const [isFileSidebarToggled, setIsFileSidebarToggled] =
    useState<boolean>(false);

  // Toggle function for the file manager sidebar
  const handleToggle = () => {
    setIsFileSidebarToggled((prev) => !prev);
  };





  return (
    <>
      <div className="relative flex flex-row h-screen overflow-hidden w-screen">
        {/* Custom Hamburger icon for mobile view */}

        {/* File Manager Sidebar */}
        {isFileSidebarToggled && (
          <ManagerSidebar
            isFileSidebarToggled={isFileSidebarToggled}
            handleToggle={handleToggle}
          />
        )}
        <div className="hidden sm:block">
          <ManagerSidebar
            isFileSidebarToggled={isFileSidebarToggled}
            handleToggle={handleToggle}
          />
        </div>

        <div className="flex-1 overflow-y-auto w-full">
          <div className="flex flex-col h-full">
            {/* Chat Header */}
            <div className="sticky top-0 flex justify-center items-center z-40 font-bold p-4 bg-secondary text-gray-100">
              <div className="absolute left-4 sm:hidden">
                <button className="p-2" onClick={handleToggle}>
                  {!isFileSidebarToggled ? (
                    <AlignLeft className="text-gray-100" />
                  ) : (
                    <X className="text-gray-100" />
                  )}
                </button>
              </div>
              <div className="text-primary capitalize text-lg text-center">
                STL-BOT
              </div>
            </div>

            {/* Chat UI */}
            <div className="flex-grow overflow-y-auto">
              <ChatUI
                messages={messages}
                tempMessage={"tempMessage"}
                name={"Customer Support Bot"}
              />
            </div>

            {/* Chat Input */}
            <div className="bg-background text-primary py-4 bottom-0 w-full">
              <ChatInput
                // prompts={chatData.bots.prompts}
                allow_free_chat={true}
                isLoading={false}
                handleInteractStream={(prompt: string) => { console.log(prompt) }} 
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicChat;
