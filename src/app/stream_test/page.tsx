"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Response = {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
};

export default function Page() {
  const [responses, setResponses] = useState<Response[]>([]);
  const handleSubmit = async (formData: FormData) => {
    const res = await fetch(
      "http://mvxmt.tail8d155b.ts.net:11434/api/generate",
      {
        method: "POST",
        body: JSON.stringify({
          model: "llama3.2",
          prompt: formData.get("query")!,
          stream: true,
        }),
      },
    );
    if (res.body) {
      res.body
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(
          new TransformStream<string, Response>({
            async transform(chunk, controller) {
              try {
                controller.enqueue(JSON.parse(chunk) as Response);
              } catch {
                chunk
                  .split("\n")
                  .filter(v => v.length > 0)
                  .map((v) => {console.log(v); return JSON.parse(v) as Response})
                  .forEach((v) => controller.enqueue(v));
              }
            },
          }),
        )
        .pipeTo(
          new WritableStream({
            write(val) {
              console.log(val);
              setResponses((v) => [...v, val]);
            },
            close() {
              console.log("closed");
            },
          }),
        );
    }
  };

  return (
    <div>
      <form action={handleSubmit}>
        <input name="query" required className="m-4 border-2 border-black"></input>
      </form>
      <div>
        {responses.map((v) => (
          <motion.span
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            key={v.created_at}
          >
            {v.response}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
