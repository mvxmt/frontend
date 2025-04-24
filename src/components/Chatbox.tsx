"use client";

import { isAuthenticatedAtom } from "@/utils/auth/store";
import { useAtomValue } from "jotai";
import { motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { FormHTMLAttributes, Ref, useContext } from "react";
import ChatHistoryPannel from "./ChatHistory/Pannel";
import PanelDrawer from "./Sidepanel/Panel";
import { ChatHistoryContext } from "./ChatHistory/Context";

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

const UserIcon = () => (
  <svg
    className="col-start-6 text-icon"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z"
      fill="currentColor"
    />
  </svg>
);

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

  return (
    <motion.div layout layoutId="chatbox" className="mb-4">
      <form action={sendMessage} ref={ref}>
        <div className="mt-2 grid w-full flex-shrink-0 grid-cols-7 items-center justify-stretch justify-items-center gap-4 rounded-3xl bg-background-text">
          {isAuthenticated ? <PanelDrawer /> : null}
          <input
            name="user_prompt"
            placeholder="What would you like to know..."
            className={`${isAuthenticated ? "col-span-4" : "col-span-5"} col-start-2 m-3 w-full bg-background-text text-xl text-secondary placeholder:bg-background-text focus:outline-none`}
            autoComplete="off"
            disabled={isPending}
          ></input>
          {!isAuthenticated ? (
            <Popup
              trigger={
                <button type="button">
                  <UserIcon />
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
                <UserIcon />
              </button>
            </ChatHistoryPannel>
          )}
          {isAuthenticated && (
            <button
              className="justify-self-start"
              type="button"
              onClick={() => chatHistoryContext.resetChatId()}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 6C12.5523 6 13 6.44772 13 7V11H17C17.5523 11 18 11.4477 18 12C18 12.5523 17.5523 13 17 13H13V17C13 17.5523 12.5523 18 12 18C11.4477 18 11 17.5523 11 17V13H7C6.44772 13 6 12.5523 6 12C6 11.4477 6.44772 11 7 11H11V7C11 6.44772 11.4477 6 12 6Z"
                  fill="currentColor"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M5 22C3.34315 22 2 20.6569 2 19V5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5ZM4 19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V5C20 4.44772 19.5523 4 19 4H5C4.44772 4 4 4.44772 4 5V19Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
        </div>
      </form>
      <p className="pt-4 text-center text-sm">
        Powered by Llama 3.2. Accuracy of responses cannot be guaranteed.
      </p>
    </motion.div>
  );
};
