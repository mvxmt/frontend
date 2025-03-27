'use client'
import { useState } from 'react'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [userId, setUserId] = useState<number>(1)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    const formData = new FormData()
    formData.append('src_file', file)
    formData.append('user_id', userId.toString())

    const res = await fetch('http://localhost:8000/file/upload', {
      method: 'POST',
      body: formData,
    })

    if (res.ok) {
      alert('File uploaded successfully!')
    } else {
      const err = await res.json()
      alert(`Upload failed: ${err.detail || 'Unknown error'}`)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button type="submit">Upload</button>
    </form>
  )
}
