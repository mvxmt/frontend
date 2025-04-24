import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { ulid } from "ulid";
import { z } from "zod";
import { appendMessageToChatThreadById, getChatThreadById, renameThreadById } from "./chatHistory";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "./auth/store";

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
  const [currentUlid, setULID] = useState(ulid())
  const [streamingString, setStreamingString] = useState<string[]>([])

  const streamingMessage = useMemo<ChatMessage>(() => {
    return {
      message: streamingString.join(""),
      role: "assistant",
      id: currentUlid
    }
  }, [streamingString, currentUlid])

  const streamingMessageRef = useRef(streamingMessage)
  streamingMessageRef.current = streamingMessage

  const [isStreaming, setIsStreaming] = useState(false)

  const start = () => {
    setULID(() => ulid())
    setIsStreaming(true)
  }

  const sendToken = (s: string) => {
    setStreamingString((sm) => [...sm, s]);
  };

  const end = () => {
    // We must do this since this function is called outside of React in a promise callback
    addToHistory(streamingMessageRef.current);
    setStreamingString([]);
    setIsStreaming(false)
  };

  return {sendToken, start, end, streamingMessage, isStreaming} as const;
}

export function useChatHistory(chatThreadId?: string) {
  const qc = useQueryClient()
  const chatThreadExists = useRef(false)
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)

  const [history, setHistory] = useState([] as ChatMessage[]);
  const [prevThreadId, setPrevTreadId] = useState(chatThreadId);

  if(chatThreadId !== prevThreadId) {
    setPrevTreadId(() => chatThreadId)

    if(chatThreadId) {
      getChatThreadById({id: chatThreadId}).then(ct => {
        setHistory(ct.thread)
        chatThreadExists.current = true
      }).catch(() => {
        setHistory([])
      })
    }
  }

  const commitMessageToServer = async (cm: StableChatMessage) => {
    if(chatThreadId && isAuthenticated) {
      await appendMessageToChatThreadById({
        chat_thread_id: chatThreadId,
        message: cm
      })

      if(!chatThreadExists.current) {
        await renameThreadById({id: chatThreadId, name: cm.message})
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
