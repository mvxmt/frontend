"use client";

import { Drawer } from "vaul";
import React from "react";
import PanelEntry from "@/components/Sidepanel/PanelEntry";
import { useFileInfoForUser } from "@/utils/fileRetrieval/hooks";
import FileUpload from "../FileUpload";
import { CirclePlus } from 'lucide-react';

export default function PanelDrawer() {

  const [isOpen, setOpen] = React.useState(false);

  const onDrawerOpen = (open) => {
    if (open) {
      console.log("Drawer Opened!");
    }
  };

  return (
    <Drawer.Root
      direction="left"
      open={isOpen}
      onOpenChange={(open) => {
        setOpen(open);
        onDrawerOpen(open);
      }}
    >
      <Drawer.Trigger>
      <CirclePlus color="#718096" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/0" />
        <Drawer.Content
          data-vaul-no-drag
          className="fixed bottom-0 left-0 top-0 z-10 flex h-full w-1/4 outline-none"
        >
          <DrawerContent />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
function DrawerContent() {
  const userFile = useFileInfoForUser();
  return <div className="flex h-full w-full grow flex-col overflow-y-auto bg-overlay p-5">
    <div className="mx-auto max-w-md">
      <Drawer.Title className="flex w-full content-stretch items-center justify-center px-1 pt-10 font-sans text-2xl font-bold text-secondary">
        Documents
      </Drawer.Title>
      <div className="grid grid-cols-1 gap-4">
        <div className="mb-2 mt-2 text-secondary">
          {userFile.isSuccess ? userFile.data.map(v => <PanelEntry key={v.id} doc_id={v.id} filename={v.filename} />) : null}
        </div>
      </div>
    </div>
    <div className="flex flex-col h-screen justify-end w-full items-center">
      <FileUpload />
    </div>
  </div>;
}