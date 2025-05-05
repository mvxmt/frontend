import { useQueryClient } from "@tanstack/react-query";
import { useMemo, useRef, useState } from "react";
import { ulid } from "ulid";
import { z } from "zod";
import {
  appendMessageToChatThreadById,
  getChatThreadById,
  renameThreadById,
} from "./chatHistory";
import { atom, getDefaultStore, useAtomValue } from "jotai";
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
  const ulidAtom = useMemo(() => atom(ulid()), []);
  const streamingStringAtom = useMemo(() => atom<string[]>([]), []);

  const streamingMessageAtom = useMemo(
    () =>
      atom<ChatMessage>((get) => ({
        id: get(ulidAtom),
        message: get(streamingStringAtom).join(""),
        role: "assistant",
      })),
    [ulidAtom, streamingStringAtom],
  );
  const streamingMessage = useAtomValue(streamingMessageAtom);

  const [isStreaming, setIsStreaming] = useState(false);

  const start = () => {
    const store = getDefaultStore();
    store.set(ulidAtom, () => ulid());
    setIsStreaming(true);
  };

  const sendToken = (s: string) => {
    const store = getDefaultStore();
    store.set(streamingStringAtom, (sm) => [...sm, s]);
  };

  const end = () => {
    const store = getDefaultStore();
    addToHistory(store.get(streamingMessageAtom));
    store.set(streamingStringAtom, []);
    setIsStreaming(false);
  };

  return { sendToken, start, end, streamingMessage, isStreaming } as const;
}

export function useChatHistory(chatThreadId?: string) {
  const qc = useQueryClient();
  const chatThreadExists = useRef(false);
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);

  const [history, setHistory] = useState([] as ChatMessage[]);
  const [prevThreadId, setPrevTreadId] = useState(chatThreadId);

  if (chatThreadId !== prevThreadId) {
    chatThreadExists.current = false
    setPrevTreadId(() => chatThreadId);

    if (chatThreadId) {
      getChatThreadById({ id: chatThreadId })
        .then((ct) => {
          setHistory(ct.thread);
          chatThreadExists.current = true;
        })
        .catch(() => {
          setHistory([]);
        });
    }
  }

  const commitMessageToServer = async (cm: StableChatMessage) => {
    if (chatThreadId) {
      await appendMessageToChatThreadById({
        chat_thread_id: chatThreadId,
        message: cm,
      });

      if (!chatThreadExists.current) {
        await renameThreadById({ id: chatThreadId, name: cm.message });
        qc.invalidateQueries({ queryKey: ["chatHistory"] });
        chatThreadExists.current = true;
      }
    }
  };

  const addToHistory = (cm: ChatMessage) => {
    setHistory((v) => [...v, cm]);
    if(isAuthenticated) {
      commitMessageToServer(cm as StableChatMessage);
    }
  };

  return { history, addToHistory };
}
