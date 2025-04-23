import * as Dialog from "@radix-ui/react-dialog";

export default function RenameDialog({
  children,
  onRename,
  open,
  onOpenChange,
}: React.PropsWithChildren<{
  onRename: (name: string) => void;
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
}>) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-10 max-h-[85vh] w-[90vw] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-md border-2 bg-background p-[25px] font-sans text-white shadow-[var(--shadow-6)] focus:outline-none">
          <Dialog.Title className="m-0 text-[17px] font-medium">
            Rename Chat Thread
          </Dialog.Title>
          <form
            className="flex w-full flex-col space-y-4 pt-4"
            action={(f) => {
              onRename(f.get("name") as string);
            }}
          >
            <input
              className="bg-neutral-800 p-2"
              name="name"
              required
              placeholder="New Name"
              type="text"
              minLength={2}
            ></input>
            <div className="mt-[25px] flex justify-end">
              <button
                type="submit"
                className="hover:bg-green5 focus-visible:outline-green6 inline-flex h-[35px] select-none items-center justify-center rounded border-2 bg-btn-background px-[15px] font-medium leading-none outline-none outline-offset-1 focus-visible:outline-2"
              >
                Rename
              </button>
            </div>
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              X
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
