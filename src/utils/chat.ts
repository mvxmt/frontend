
import { useState } from "react";

export type ChatMessage = {
    id: string
    role: "assistant" | "user",
    message: string
}

export function useChatHistory() {
    const [history, setHistory] = useState([] as ChatMessage[])

    const addToHistory = (cm: ChatMessage) => {
        setHistory(v => [...v, cm])
    }

    return {history, addToHistory}
}