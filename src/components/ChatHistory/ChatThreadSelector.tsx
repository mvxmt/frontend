"use client";

import {
  useDeleteChatThread,
  useRenameChatThread,
} from "@/utils/chatHistory/hooks";
import RenameDialog from "./RenameDialog";
import { useContext, useState } from "react";
import { ChatHistoryContext } from "./Context";
import { Pencil, CircleX } from 'lucide-react';

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
      className={`grid cursor-pointer grid-cols-6 grid-rows-1 justify-center gap-5 rounded-2xl ${selected ? "bg-gray-500/30 box-content" : "bg-gray-700/30"}  py-3 px-4`}
    >
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
          <Pencil color="#718096" />
        </div>
      </RenameDialog>
      <div className="col-span-4 py-2 text-center font-sans text-lg text-secondary">
        {name}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          deleteMutation.mutate({ id: ct_id }, {
            onSuccess: (_, v) => {
              if (v.id === chatHistoryContext.activeChatId) {
                chatHistoryContext.resetChatId()
              }
            }
          });
        }}
      >
        <div className="content-center">
        <CircleX color="#718096" />
        </div>
      </button>
    </div>
  );
}
