"use client";

import { useDeleteFileMutation} from "@/utils/fileRetrieval/hooks";
import { useQueryClient } from "@tanstack/react-query";

export default function PanelDrawer({ doc_id,filename }) {
  const deleteFile = useDeleteFileMutation();
  const queryClient = useQueryClient();

  const handleFileDelete=(doc_id:string)=>{
    deleteFile.mutate({id:doc_id});
    //Force Refetch
    queryClient.invalidateQueries({ queryKey: ["userFiles"] });;
  }
  return (
    <div className="grid grid-cols-6 grid-rows-1 gap-5 py-5 justify-center">
      <div className="content-center px-2">
        <svg
          width="20"
          xmlns="http://www.w3.org/2000/svg"
          height="24.667"
          viewBox="-418 147.667 27 31.667"
          fill="none"
        >
          <path
            d="M-418 152.417c0-2.624 2.015-4.75 4.5-4.75h12c5.799 0 10.5 4.962 10.5 11.083v15.833c0 2.624-2.015 4.75-4.5 4.75h-18c-2.485 0-4.5-2.126-4.5-4.75zm15-1.584h-10.5c-.828 0-1.5.709-1.5 1.584v22.166c0 .875.672 1.584 1.5 1.584h18c.828 0 1.5-.709 1.5-1.584V158.75h-9zm8.376 4.75c-.964-2.329-2.959-4.073-5.376-4.591v4.591z"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="col-start-2 col-span-4 py-2 text-center font-sans text-lg text-secondary">
        {filename}
      </div>
      <button onClick={() => {
          handleFileDelete(doc_id)
        }}>
        <div className="content-center col-start-5">
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
              fill-rule="evenodd"
              clip-rule="evenodd"
              fill="currentColor"
            />
          </svg>
        </div>
      </button>
    </div>
  );
}