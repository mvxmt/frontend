import { atom, getDefaultStore, useAtomValue, useSetAtom } from "jotai";
import { useMemo, useState } from "react";
import { v4 } from "uuid";

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
  const uuidAtom = useMemo(() => atom(v4()), [])
  const streamingStringAtom = useMemo(() => atom([] as string[]), [])
  const streamingMessageAtom = useMemo(() => atom(get => ({
    message: get(streamingStringAtom).join(""),
    role: "assistant",
    id: get(uuidAtom)
  } as ChatMessage)), [streamingStringAtom, uuidAtom])

  const setUUID = useSetAtom(uuidAtom)
  const setStreamingString = useSetAtom(streamingStringAtom)
  const streamingMessage = useAtomValue(streamingMessageAtom)

  const start = () => {
    setUUID(() => v4())
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
  };

  return [sendToken, start, end, streamingMessage] as const;
}

export function useChatHistory() {
  const [history, setHistory] = useState([] as ChatMessage[]);

  const addToHistory = (cm: ChatMessage) => {
    setHistory((v) => [...v, cm]);
  };

  return { history, addToHistory };
}
