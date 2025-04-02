"use client";

import { FormHTMLAttributes, Ref } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";
import { useUserInfo } from "@/utils/auth/hooks";
import { logout } from "@/utils/auth";
import { useSetAtom } from "jotai";
import { tokenAtom } from "@/utils/auth/store";
import PanelDrawer from "./Sidepanel/Panel";

const Popup = dynamic(() => import("reactjs-popup"), { ssr: false });

export const ChatBox: React.FC<{
  sendMessage?: FormHTMLAttributes<HTMLFormElement>["action"];
  isPending?: boolean;
  ref?: Ref<HTMLFormElement>;
}> = ({ sendMessage, isPending, ref }) => {
  const queryClient = useQueryClient()
  const userInfo = useUserInfo()

  const handleLogout = async () => {
    await logout()
    await queryClient.resetQueries()
  };

  return (
    <motion.div layout className="mb-4">
      <form action={sendMessage} ref={ref}>
        <div className="grid h-[75px] w-[960px] flex-shrink-0 grid-cols-6 content-stretch items-center justify-stretch justify-items-center self-center rounded-3xl bg-background-text">
        <PanelDrawer />

          <input
            name="query"
            placeholder="What would you like to know..."
            className="col-span-4 col-start-2 w-full bg-background-text text-2xl text-secondary placeholder:bg-background-text focus:outline-none"
            autoComplete="off"
            disabled={isPending}
          ></input>
          <Popup
            trigger={
              <button type="button">
                <svg
                  className="col-start-6 text-icon"
                  width="36"
                  height="36"
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
              </button>
            }
            position="top center"
          >
            <div className="flex h-[75px] w-[282px] flex-col content-stretch items-center justify-items-center rounded-3xl bg-background-text">
              {!userInfo.data ? (
                <button
                  type="button"
                  className="flex h-full w-full content-stretch items-center justify-center bg-transparent px-5 font-sans text-secondary"
                  title="Sign In"
                >
                  <Link href={`/login/`}>Sign In</Link>
                </button>
              ) : (
                <button
                  type="button"
                  className="flex h-full w-full content-stretch items-center justify-center bg-transparent px-5 font-sans text-secondary"
                  title="Sign In"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              )}
            </div>
          </Popup>
        </div>
      </form>
      <p className="pt-4 text-center">
        Powered by Llama 3.2. Accuracy of responses cannot be guaranteed.
      </p>
    </motion.div>
  );
};
