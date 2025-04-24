"use client";

import {
  useDeleteChatThread,
  useRenameChatThread,
} from "@/utils/chatHistory/hooks";
import RenameDialog from "./RenameDialog";
import { useContext, useState } from "react";
import { ChatHistoryContext } from "./Context";

export default function ChatThreadSelector({
  ct_id,
  name,
  onSelect,
  selected
}: {
  ct_id: string;
  name: string;
  selected: boolean
  onSelect: () => void;
}) {
  const chatHistoryContext = useContext(ChatHistoryContext)
  const deleteMutation = useDeleteChatThread();
  const renameMutation = useRenameChatThread();

  const [renameModalOpen, setRenameModalOpen] = useState(false);

  return (
    <div
      onClick={onSelect}
      className={`grid cursor-pointer grid-cols-6 grid-rows-1 justify-center gap-5 rounded-full ${selected ? "bg-gray-500/30 border-2 box-content" : "bg-gray-700/30"}  py-3`}
    >
      <div className="col-span-4 py-2 text-center font-sans text-lg text-secondary">
        {name}
      </div>
      <RenameDialog
        open={renameModalOpen}
        onOpenChange={setRenameModalOpen}
        onRename={(n) => {
          renameMutation.mutate(
            { name: n, id: ct_id },
            {
              onSuccess: () => {
                setRenameModalOpen(false);
              },
            },
          );
        }}
      >
        <div className="content-center px-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M21.2635 2.29289C20.873 1.90237 20.2398 1.90237 19.8493 2.29289L18.9769 3.16525C17.8618 2.63254 16.4857 2.82801 15.5621 3.75165L4.95549 14.3582L10.6123 20.0151L21.2189 9.4085C22.1426 8.48486 22.338 7.1088 21.8053 5.99367L22.6777 5.12132C23.0682 4.7308 23.0682 4.09763 22.6777 3.70711L21.2635 2.29289ZM16.9955 10.8035L10.6123 17.1867L7.78392 14.3582L14.1671 7.9751L16.9955 10.8035ZM18.8138 8.98525L19.8047 7.99429C20.1953 7.60376 20.1953 6.9706 19.8047 6.58007L18.3905 5.16586C18 4.77534 17.3668 4.77534 16.9763 5.16586L15.9853 6.15683L18.8138 8.98525Z"
              fill="currentColor"
            />
            <path
              d="M2 22.9502L4.12171 15.1717L9.77817 20.8289L2 22.9502Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </RenameDialog>
      <button
        onClick={(e) => {
          e.stopPropagation()
          deleteMutation.mutate({ id: ct_id }, {
            onSuccess: (_, v) => {
              if(v.id === chatHistoryContext.activeChatId) {
                chatHistoryContext.resetChatId()
              }
            }
          });
        }}
      >
        <div className="content-center">
          <svg
            width="24"
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="-89.5 151.5 24 24"
            fill="none"
          >
            <path
              d="M-73.161 160.822a1 1 0 1 0-1.363-1.463l-2.926 2.728-2.728-2.927a1 1 0 1 0-1.463 1.364l2.728 2.926-2.927 2.727a1 1 0 0 0 1.364 1.464l2.926-2.728 2.727 2.926a1 1 0 1 0 1.463-1.363l-2.727-2.926z"
              fill="currentColor"
            />
            <path
              d="M-88.5 163.5c0-6.075 4.925-11 11-11s11 4.925 11 11-4.925 11-11 11-11-4.925-11-11m11 9a9 9 0 0 1-9-9 9 9 0 0 1 9-9 9 9 0 0 1 9 9 9 9 0 0 1-9 9"
              fillRule="evenodd"
              clipRule="evenodd"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}
