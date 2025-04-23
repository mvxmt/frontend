'use client'
import { useEffect, useRef, useState } from 'react'
import { useUploadFileMutation } from "@/utils/fileUpload/hooks"
import { useQueryClient } from "@tanstack/react-query";

export default function FileUpload() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useUploadFileMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    queryClient.invalidateQueries({ queryKey: ["userFiles"] });
  }

  useEffect(() => {
    if (file !== null) {
      uploadFile.mutate({ file }, {
        onSuccess() {
          setFile(null)
        }
      })
    }
  }, [file])

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={fileInputRef}
        type="file"
        name="fileElem"
        className="hidden"
        onChange={e => {
          setFile(e.target.files?.[0] || null)
        }}
      />
      <button className='bg-background px-14 py-4 font-sans text-xl font-semibold text-secondary' onClick={() => fileInputRef.current?.click()} id="fileUpload" type="button">Upload</button>
    </form>
  )
}
