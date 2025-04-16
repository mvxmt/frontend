"use client";

import { Drawer } from "vaul";
import React from "react";
import PanelEntry from "@/components/Sidepanel/PanelEntry";
import { useFileInfoForUser } from "@/utils/fileRetrieval/hooks";
import FileUpload from "../FileUpload";

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
        <svg
          className="text-icon"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4Z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13 7C13 6.44772 12.5523 6 12 6C11.4477 6 11 6.44772 11 7V11H7C6.44772 11 6 11.4477 6 12C6 12.5523 6.44772 13 7 13H11V17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17V13H17C17.5523 13 18 12.5523 18 12C18 11.4477 17.5523 11 17 11H13V7Z"
            fill="currentColor"
          />
        </svg>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/0" />
        <Drawer.Content
          data-vaul-no-drag
          className="fixed bottom-0 left-0 top-0 z-10 flex h-full w-[450px] outline-none"
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
      <Drawer.Title className="flex w-full content-stretch items-center justify-center px-1 pt-10 font-sans text-4xl font-semibold text-secondary">
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

