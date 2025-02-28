"use server";

//import { cookies } from "next/headers";

const waitFor = (ms: number) => new Promise(res => setTimeout(res, ms))


export const submitPrompt = async (data: FormData) => {  
  const query = data.get("query");
  const formData = new FormData()
  formData.append("user_prompt", query!.toString())
  const response = await fetch("http://127.0.0.1:8000/chat/response", {
    method: 'POST',
    body: formData
  })
  console.log(response.status)
  console.log(`Submit Prompt: ${query}`);

  if(response.ok) {
    return response.text()!
  }

  return
};

