import { atom, getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useMemo, useRef, useState } from "react";
import { ulid } from "ulid";
import { z } from "zod";
import { appendMessageToChatThreadById, getChatThreadById } from "./chatHistory";
import { useQueryClient } from "@tanstack/react-query";

export const zChatMessage = z.object({
  id: z.string().ulid(),
  role: z.enum(["assistant", "user", "loading"]),
  message: z.string(),
});

export type ChatMessage = z.infer<typeof zChatMessage>;

export const zStableChatMessage = z.intersection(
  zChatMessage,
  z.object({
    role: z.enum(["assistant", "user"]),
  }),
);

export type StableChatMessage = z.infer<typeof zStableChatMessage>;

export function useTextStream({
  addToHistory,
}: {
  addToHistory: (cm: ChatMessage) => void;
}) {
  const ulidAtom = useMemo(() => atom(ulid()), [])
  const streamingStringAtom = useMemo(() => atom([] as string[]), [])
  const streamingMessageAtom = useMemo(() => atom(get => ({
    message: get(streamingStringAtom).join(""),
    role: "assistant",
    id: get(ulidAtom)
  } as ChatMessage)), [streamingStringAtom, ulidAtom])
  const [isStreaming, setIsStreaming] = useState(false)

  const setULID = useSetAtom(ulidAtom);
  const setStreamingString = useSetAtom(streamingStringAtom);
  const streamingMessage = useAtomValue(streamingMessageAtom);

  const start = () => {
    setULID(() => ulid())
    setIsStreaming(true)
  }

  const sendToken = (s: string) => {
    setStreamingString((sm) => [...sm, s]);
  };

  const end = () => {
    // We must do this since this function is called outside of React in a promise callback
    const defaultStore = getDefaultStore();

    const chatMessage = defaultStore.get(streamingMessageAtom);
    console.log(`end: ${JSON.stringify(chatMessage)}`);
    addToHistory(chatMessage);
    setStreamingString([]);
    setIsStreaming(false)
  };

  return {sendToken, start, end, streamingMessage, isStreaming} as const;
}

export function useChatHistory(chatThreadId?: string) {
  const qc = useQueryClient()
  const chatThreadExists = useRef(false)
  const [history, setHistory] = useState([] as ChatMessage[]);

  useEffect(() => {
    chatThreadExists.current = false
    if(chatThreadId) {
      getChatThreadById({id: chatThreadId}).then(ct => {
        setHistory(ct.thread)
        chatThreadExists.current = true
      }).catch(() => {
        setHistory([])
      })
    }
  }, [chatThreadId])

  const commitMessageToServer = async (cm: StableChatMessage) => {
    if(chatThreadId) {
      await appendMessageToChatThreadById({
        chat_thread_id: chatThreadId,
        message: cm
      })

      if(!chatThreadExists.current) {
        qc.invalidateQueries({queryKey: ["chatHistory"]})
        chatThreadExists.current = true
      }
    }
  }

  const addToHistory = (cm: ChatMessage) => {
    setHistory((v) => [...v, cm]);
    commitMessageToServer(cm as StableChatMessage)
  };

  return { history, addToHistory };
}
