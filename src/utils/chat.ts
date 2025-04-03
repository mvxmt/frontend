import { atom, getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import {ulid} from "ulid";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "loading";
  message: string;
};

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

  const setUUID = useSetAtom(ulidAtom)
  const setStreamingString = useSetAtom(streamingStringAtom)
  const streamingMessage = useAtomValue(streamingMessageAtom)

  const start = () => {
    setUUID(() => ulid())
    setIsStreaming(true)
  }

  const sendToken = (s: string) => {
    setStreamingString((sm) => [...sm, s]);
  };

  const end = () => {
    // We must do this since this function is called outside of React in a promise callback
    const defaultStore = getDefaultStore()

    const chatMessage = defaultStore.get(streamingMessageAtom)
    console.log(`end: ${JSON.stringify(chatMessage)}`)
    addToHistory(chatMessage);
    setStreamingString([]);
    setIsStreaming(false)
  };

  return {sendToken, start, end, streamingMessage, isStreaming} as const;
}

export function useChatHistory() {
  const [history, setHistory] = useState([] as ChatMessage[]);

  const addToHistory = (cm: ChatMessage) => {
    setHistory((v) => [...v, cm]);
  };

  return { history, addToHistory };
}
