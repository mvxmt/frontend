"use client";

import { ChatBox } from "@/components/Chatbox";
import ChatHistoryPannel from "@/components/ChatHistory/Pannel";
import ChatThread from "@/components/ChatThread";
import { useUserInfo } from "@/utils/auth/hooks";
import { tokenAtom } from "@/utils/auth/store";
import { ChatMessage, useChatHistory, useTextStream } from "@/utils/chat";
import { useAtomValue } from "jotai";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Home() {
  const { history, addToHistory } = useChatHistory();
  const {
    sendToken,
    start: startStreaming,
    end: endStreaming,
    streamingMessage,
    isStreaming,
  } = useTextStream({
    addToHistory,
  });
  const token = useAtomValue(tokenAtom)

  const formRef = useRef<HTMLFormElement>(null);
  const userInfo = useUserInfo();

  const handleSubmit = async (token: string | undefined, formData: FormData) => {
      const userMessage = {
        role: "user",
        message: formData.get("user_prompt") as string,
        id: uuidv4(),
      } as ChatMessage;

      addToHistory(userMessage);
      formRef.current?.reset();

      startStreaming();

      fetch("/api/chat/response", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (response.body) {
          response.body.pipeThrough(new TextDecoderStream()).pipeTo(
            new WritableStream({
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
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div
        className={`mx-auto flex min-h-screen w-full max-w-xl flex-col justify-center ${history.length > 0 ? "justify-between" : "justify-center"} gap-[20px] font-sans text-secondary`}
      >
        <AnimatePresence mode="popLayout">
          {history.length < 1 && (
            <motion.h1
              exit={{ opacity: 0, position: "absolute" }}
              className={`self-center text-center text-6xl`}
            >
              Welcome{userInfo.data ? " " + userInfo.data.name : ""},
            </motion.h1>
          )}
        </AnimatePresence>

        {history.length > 0 && (
          <div className="w-full flex-1 overflow-y-auto p-6 lg:pt-24">
            <ChatThread
              pendingMessage={streamingMessage}
              messageHistory={history}
              isPendingMessage={isStreaming}
            ></ChatThread>
          </div>
        )}
        <div className="sticky bottom-0 z-10 bg-background">
          <ChatBox ref={formRef} sendMessage={(d) => handleSubmit(token, d)}></ChatBox>
        </div>
        <ChatHistoryPannel/>
      </div>
    </div>
  );
}
