"use client";

import { testAction } from "@/actions/chatboxSubmit";
import { submitPrompt } from "@/actions/chatboxSubmit";

import {ChatBox} from "@/components/Chatbox";
import ChatThread from "@/components/ChatThread";
import { ChatMessage, useChatHistory } from "@/utils/chat";
import { AnimatePresence, motion } from "motion/react";
import { useOptimistic, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const [loading, setLoading] = useState(false)
  const { history, addToHistory } = useChatHistory();
  const [oHistory, addHistoryOptimisitic] = useOptimistic(
    history,
    (state, v: ChatMessage) => [...state, v, {id: "loading", role: "loading" as const, message: ""}],
  );

  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (formData: FormData) => {
    const userMessage = {
      role: "user",
      message: formData.get("query") as string,
      id: uuidv4(),
    } as ChatMessage
    
    addHistoryOptimisitic(userMessage)
    formRef.current?.reset()

    addToHistory(userMessage)
    setLoading(true)
    const response = await submitPrompt(formData);
    setLoading(false)
    addToHistory({
      role: "assistant",
      message: response!, //LLM response goes here
      id: uuidv4(),
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <div
        className={`flex w-full flex-1 flex-col content-stretch items-center ${oHistory.length > 0 ? "justify-between" : "justify-center"} gap-[20px] font-sans text-secondary`}
      >
        <AnimatePresence mode="popLayout">
          {oHistory.length < 1 && (
            <motion.h1
              exit={{ opacity: 0, position: "absolute" }}
              className={`self-center text-7xl`}
            >
              Welcome,
            </motion.h1>
          )}
        </AnimatePresence>

        {oHistory.length > 0 && (
          <div className="w-1/2 p-6 lg:pt-24">
            <ChatThread loading={loading} messageHistory={oHistory}></ChatThread>
          </div>
        )}

        <ChatBox ref={formRef} sendMessage={handleSubmit}></ChatBox>
      </div>
    </div>
  );
}
