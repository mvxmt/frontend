"use client";

import { ChatBox } from "@/components/Chatbox";
import ChatThread from "@/components/ChatThread";
import { useUserInfo } from "@/utils/auth/hooks";
import { ChatMessage, useChatHistory, useTextStream } from "@/utils/chat";
import { AnimatePresence, motion } from "motion/react";
import { useRef } from "react";
import { v4 as uuidv4 } from "uuid";

type Response = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
};

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
      message: formData.get("query") as string,
      id: uuidv4(),
    } as ChatMessage;

    addToHistory(userMessage);
    formRef.current?.reset();

    fetch("http://mvxmt.tail8d155b.ts.net:11434/api/generate", {
      method: "POST",
      body: JSON.stringify({
        model: "llama3.2",
        prompt: formData.get("query")!,
        stream: true,
      }),
    }).then((response) => {
      if (response.body) {
        response.body
          .pipeThrough(new TextDecoderStream())
          .pipeThrough(
            new TransformStream<string, Response>({
              async transform(chunk, controller) {
                try {
                  controller.enqueue(JSON.parse(chunk) as Response);
                } catch {
                  chunk
                    .split("\n")
                    .filter((v) => v.length > 0)
                    .map((v) => {
                      console.log(v);
                      return JSON.parse(v) as Response;
                    })
                    .forEach((v) => controller.enqueue(v));
                }
              },
            }),
          )
          .pipeTo(
            new WritableStream({
              start() {
                startStreaming();
              },
              write(val) {
                sendToken(val.response);
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
    <div className="flex justify-center min-h-screen flex-col items-center bg-background">
      <div
        className={`w-full max-w-xl mx-auto gap-[20px] font-sans text-secondary justify-center" ${history.length > 0 ? "justify-between" : "justify-center"}
        `}
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
          <div className="w-full p-6 lg:pt-24">
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
