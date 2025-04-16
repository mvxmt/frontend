import type { ChatMessage } from "@/utils/chat";
import { AnimatePresence, motion } from "motion/react";

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <motion.div
      initial={{ transform: "translateY(4rem)" }}
      animate={{ transform: "translateY(0rem)" }}
      className={`rounded-xl bg-background-text p-4 ${message.role === "user" ? "self-end rounded-br-none" : "self-start rounded-bl-none"} max-w-5/12`}
    >
      {message.message}
      {message.role === "loading" && (
        <div className="scale-[35%]">
          <span className="loader"></span>
        </div>
      )}
    </motion.div>
  );
};

export default function ChatThread({
  messageHistory,
  pendingMessage,
  isPendingMessage,
}: {
  messageHistory: ChatMessage[];
  pendingMessage: ChatMessage;
  isPendingMessage?: boolean;
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      <AnimatePresence>
        {messageHistory.map((m) => (
          <Message key={m.id} message={m} />
        ))}
        {pendingMessage.message.length > 0 ? (
          <Message key={pendingMessage.id} message={pendingMessage} />
        ) : isPendingMessage ? (
          <Message key={pendingMessage.id} message={{...pendingMessage, role: "loading"}}></Message>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
