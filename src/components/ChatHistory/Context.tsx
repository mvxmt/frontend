import { createContext } from "react";

type ChatHistoryContextT = {
    activeChatId: string
    setActiveChatId: (id: string) => void
    resetChatId: () => void
}

export const ChatHistoryContext = createContext<ChatHistoryContextT>({
    activeChatId: "",
    setActiveChatId: () => {},
    resetChatId: () => {}
})