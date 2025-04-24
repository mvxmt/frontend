"use client";

import { logout } from "@/utils/auth";
import { useChatHistoryForUser } from "@/utils/chatHistory/hooks";
import { useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { Drawer } from "vaul";
import ChatThreadSelector from "./ChatThreadSelector";
import { ChatHistoryContext } from "./Context";

export default function ChatHistoryPannel({
  children,
}: React.PropsWithChildren) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const { data: chatThreads } = useChatHistoryForUser();
  const chatHistoryContext = useContext(ChatHistoryContext)

  const handleLogout = async () => {
    await logout();
    queryClient.resetQueries();
    chatHistoryContext.resetChatId()
  };


  return (
    <Drawer.Root direction="right" open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0" />
        <Drawer.Content
          data-vaul-no-drag
          className="fixed bottom-0 right-0 top-0 z-10 flex h-full w-1/4 outline-none"
        >
          <div className="flex h-full w-full grow flex-col overflow-y-auto bg-overlay p-5">
            <div className="mx-auto max-w-md">
              <Drawer.Title className="flex w-full content-stretch items-center justify-center px-1 pt-10 font-sans text-2xl font-bold text-secondary">
                Chat Threads
              </Drawer.Title>
              <div className="grid grid-cols-1 gap-4">
                <div className="mb-2 mt-2 space-y-4 text-secondary">
                  {chatThreads &&
                    chatThreads.map((ct) => (
                      <ChatThreadSelector
                        onSelect={() => chatHistoryContext.setActiveChatId(ct.id)}
                        selected={chatHistoryContext.activeChatId == ct.id}
                        key={ct.id}
                        name={ct.name}
                        ct_id={ct.id}
                      />
                    ))}
                </div>
              </div>
            </div>
            <div className="flex h-screen w-full flex-col items-center justify-end">
              <button
                className="bg-background px-14 py-4 font-sans text-xl font-semibold text-secondary"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
