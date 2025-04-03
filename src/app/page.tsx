"use client";

import { ChatBox } from "@/components/Chatbox";
import ChatThread from "@/components/ChatThread";
import { useUserInfo } from "@/utils/auth/hooks";
import { ChatMessage, useChatHistory, useTextStream } from "@/utils/chat";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { history, addToHistory } = useChatHistory();
  const [sendToken, startStreaming, endStreaming, streamingMessage] =
    useTextStream({
      addToHistory,
    });

  const formRef = useRef<HTMLFormElement>(null);
  const userInfo = useUserInfo();

  const handleSubmit = (formData: FormData) => {
    const userMessage = {
      role: "user",
      message: formData.get("user_prompt") as string,
      id: uuidv4(),
    } as ChatMessage;

    addToHistory(userMessage);
    formRef.current?.reset();

    fetch("/api/chat/response", {
      method: "POST",
      body: formData,
    }).then((response) => {
      if (response.body) {
        response.body
          .pipeThrough(new TextDecoderStream())
          .pipeTo(
            new WritableStream({
              start() {
                startStreaming();
              },
              write(val) {
                sendToken(val);
              },
              close() {
                endStreaming();
              },
            }),
          );
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <div
        className={`flex w-full flex-1 flex-col content-stretch items-center ${history.length > 0 ? "justify-between" : "justify-center"} gap-[20px] font-sans text-secondary`}
      >
        <AnimatePresence mode="popLayout">
          {history.length < 1 && (
            <motion.h1
              exit={{ opacity: 0, position: "absolute" }}
              className={`self-center text-7xl`}
            >
              Welcome{userInfo.data ? " " + userInfo.data.name : ""},
            </motion.h1>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="w-1/2 p-6 lg:pt-24">
            <ChatThread
              pendingMessage={streamingMessage}
              messageHistory={history}
            ></ChatThread>
          </div>
        )}

        <ChatBox ref={formRef} sendMessage={handleSubmit}></ChatBox>
      </div>
    </div>
  );
}
