"use client";

import { testAction } from "@/actions/chatboxSubmit";
import { ChatBox } from "@/components/Chatbox";
import ChatThread from "@/components/ChatThread";
import { ChatMessage, useChat } from "@/utils/chat";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { history, sendMessage, resetHistory } = useChat(testAction);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const userMessage = {
      role: "user",
      message: formData.get("query") as string,
      id: uuidv4(),
    } as ChatMessage;
    formRef.current?.reset()
    await sendMessage(userMessage);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <div
        className={`flex w-full flex-1 flex-col content-stretch items-center ${history.length > 0 ? "justify-between" : "justify-center"} gap-[20px] font-sans text-secondary`}
      >
        <AnimatePresence mode="popLayout">
          {history.length < 1 && (
            <motion.h1
              exit={{ opacity: 0 }}
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className={`self-center text-7xl`}
            >
              Welcome,
            </motion.h1>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="w-1/2 p-6 lg:pt-24">
            <ChatThread messageHistory={history}></ChatThread>
          </div>
        )}

        <ChatBox
          ref={formRef}
          sendMessage={handleSubmit}
          onPlus={resetHistory}
        ></ChatBox>
      </div>
    </div>
  );
}
