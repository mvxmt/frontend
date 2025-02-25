"use server";
import type { ChatMessage } from "@/utils/chat";
import { v4 as uuidv4 } from "uuid";

const waitFor = (ms: number) => new Promise(res => setTimeout(res, ms))

export const testAction = async (_ctx: ChatMessage, requestedId: string): Promise<ChatMessage> => {
  await waitFor(1000)
  return {
    id: requestedId,
    message: uuidv4(),
    role: "assistant"
  }
};
