'use client'
import { useUploadFileMutation } from "@/utils/fileUpload/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from 'react';

export default function FileUpload() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useUploadFileMutation();

  return (
    <form>
      <input
        ref={fileInputRef}
        type="file"
        name="fileElem"
        className="hidden"
        onChange={e => {
          e.preventDefault()
          const maybeFile = e.target.files?.item(0)
          if(maybeFile) {
            uploadFile.mutate({ file: maybeFile }, {
              onSuccess() {
                queryClient.invalidateQueries({ queryKey: ["userFiles"] });
              }
            })
          }
        }}
      />
      <button className='bg-background px-14 py-4 font-sans text-xl font-semibold text-secondary' onClick={() => fileInputRef.current?.click()} id="fileUpload" type="button">Upload</button>
    </form>
  )
}
