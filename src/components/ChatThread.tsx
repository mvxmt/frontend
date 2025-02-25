import type { ChatMessage } from "@/utils/chat";
import { motion } from "motion/react";

type MessageProps = {
  message: ChatMessage
}

const Message: React.FC<MessageProps> = ({message}) => {
  return (
    <motion.div
      initial={{ transform: "translateY(4rem)" }}
      animate={{ transform: "translateY(0rem)" }}
      className={`rounded-xl bg-background-text p-4 ${message.role === "user" ? "self-end rounded-br-none" : "self-start rounded-bl-none"} max-w-5/12 min-w-2/12`}
    >
      {message.message}
      {message.role === "loading" && <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24"><circle cx={4} cy={12} r={3} fill="currentColor"><animate id="svgSpinners3DotsBounce0" attributeName="cy" begin="0;svgSpinners3DotsBounce1.end+0.25s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12"></animate></circle><circle cx={12} cy={12} r={3} fill="currentColor"><animate attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.1s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12"></animate></circle><circle cx={20} cy={12} r={3} fill="currentColor"><animate id="svgSpinners3DotsBounce1" attributeName="cy" begin="svgSpinners3DotsBounce0.begin+0.2s" calcMode="spline" dur="0.6s" keySplines=".33,.66,.66,1;.33,0,.66,.33" values="12;6;12"></animate></circle></svg>}
    </motion.div>
  );
};

export default function ChatThread({
  messageHistory
}: {
  messageHistory: ChatMessage[];
}) {
  return (
    <div className="flex w-full flex-col gap-4">
      {messageHistory.map((m) => (
        <Message key={m.id} message={m} />
      ))}
    </div>
  );
}
