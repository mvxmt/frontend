'use client'
import { useEffect, useRef, useState } from 'react'
import { useUploadFileMutation } from "@/utils/fileUpload/hooks"

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<number>(1)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const uploadFile = useUploadFileMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('src_file', file)
    formData.append('user_id', userId.toString())
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
      <button className='' onClick={() => fileInputRef.current?.click()} id="fileUpload" type="button">Upload</button>
    </form>
  )
}
