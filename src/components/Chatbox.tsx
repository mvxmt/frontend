"use client";

import { isAuthenticatedAtom } from "@/utils/auth/store";
import { useAtomValue } from "jotai";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FormHTMLAttributes, Ref, useContext, useState, useRef } from "react";
import ChatHistoryPannel from "./ChatHistory/Pannel";
import PanelDrawer from "./Sidepanel/Panel";
import { ChatHistoryContext } from "./ChatHistory/Context";
import { MessageSquareDiff, CircleUserRound } from 'lucide-react';

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

export const ChatBox: React.FC<{
  sendMessage?: FormHTMLAttributes<HTMLFormElement>["action"];
  isPending?: boolean;
  ref?: Ref<HTMLFormElement>;
}> = ({
  sendMessage,
  isPending,
  ref
}) => {
    const isAuthenticated = useAtomValue(isAuthenticatedAtom);
    const chatHistoryContext = useContext(ChatHistoryContext)
    const [value, setValue] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const textarea = textareaRef.current;
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";
      }
      setValue(e.target.value);
    };


    return (
      <motion.div layout layoutId="chatbox" className="mb-4">
        <form action={sendMessage} ref={ref} onSubmit={() => {
          setValue(""); 
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        }}>
          <div className="mt-2 grid w-full flex-shrink-0 grid-cols-7 items-center justify-stretch justify-items-center gap-4 rounded-3xl bg-background-text">
            {isAuthenticated ? <PanelDrawer /> : null}
            <textarea
              name="user_prompt"
              placeholder="What would you like to know..."
              className={`${isAuthenticated ? "col-span-4" : "col-span-5"} col-start-2 m-3 w-full bg-background-text text-lg text-secondary placeholder:bg-background-text focus:outline-none resize-none`}
              autoComplete="off"
              disabled={isPending}
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
              ref={textareaRef}
              value={value}
              onChange={handleChange}
            />
            {!isAuthenticated ? (
              <Popup
                trigger={
                  <button type="button">
                    <CircleUserRound color="#718096" />
                  </button>
                }
                position="top center"
              >
                <div className="mb-4 flex flex-col content-stretch items-center justify-items-center rounded-2xl bg-background-text px-4 py-3">
                  <button
                    type="button"
                    className="text-md flex h-full w-full content-stretch items-center justify-center bg-transparent px-5 font-sans text-secondary"
                    title="Sign In"
                  >
                    <Link href={`/login/`}>Sign In</Link>
                  </button>
                </div>
              </Popup>
            ) : (
              <ChatHistoryPannel>
                <button className="justify-self-end" type="button">
                  <CircleUserRound color="#718096" />
                </button>
              </ChatHistoryPannel>
            )}
            {isAuthenticated && (
              <button
                className="justify-self-start"
                type="button"
                onClick={() => chatHistoryContext.resetChatId()}
              >
                <MessageSquareDiff color="#718096" />
              </button>
            )}
          </div>
        </form>
        <p className="pt-4 text-center text-sm">
          Powered by Ollama. Accuracy of responses cannot be guaranteed.
        </p>
      </motion.div>
    );
  };
