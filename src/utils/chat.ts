import { useOptimistic, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "loading";
  message: string;
};

export function useChat(getReply: (msg: ChatMessage, id: string) => Promise<ChatMessage>) {
  const [history, setHistory] = useState([] as ChatMessage[]);
  const [oHistory, addHistoryOptimisitic] = useOptimistic(
    history,
    (state, v: ChatMessage) => [...state.filter(m => m.id != v.id), v],
  );

  const sendMessage = async (cm: ChatMessage) => {
    addHistoryOptimisitic(cm);

    const responseId = uuidv4()
    addHistoryOptimisitic({role: "loading", message: "", id: responseId})
    const reply = await getReply(cm, responseId);
    setHistory((prev) => [...prev, cm, reply]);
  };

  const resetHistory = () => setHistory([]);

  return { history: oHistory, sendMessage, resetHistory };
}
