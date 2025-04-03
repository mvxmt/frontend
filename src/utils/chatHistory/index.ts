import { z } from "zod";
import { getAuthenticatedRoute, UnauthenticatedError } from "../auth";
import { StableChatMessage, zStableChatMessage } from "../chat";

export const getAllChatThreads = getAuthenticatedRoute(async (token) => {
  const res = await fetch("/api/chatHistory/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new UnauthenticatedError();
  }

  if (!res.ok) {
    throw new Error("failed to load user profile");
  }

  return (await res.json()) as [
    {
      id: string;
      name: string;
    },
  ];
});

const threadByIdSchema = z.object({
  id: z.string().uuid(),
});

export const getChatThreadById = getAuthenticatedRoute(
  async (token, params: z.infer<typeof threadByIdSchema>) => {
    const { id } = await threadByIdSchema.parseAsync(params);
    const res = await fetch(`/api/chatHistory/thread?chat_thread_id=${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      throw new UnauthenticatedError();
    }

    if (!res.ok) {
      throw new Error("get thread by id");
    }

    return (await res.json()) as {
      id: string;
      name: string;
      thread: StableChatMessage[];
    };
  },
);

const appendMessageToChatThreadByIdSchema = z.object({
  chat_thread_id: z.string().uuid(),
  message: zStableChatMessage,
});

export const appendMessageToChatThreadById = getAuthenticatedRoute(
  async (
    token,
    params: z.infer<typeof appendMessageToChatThreadByIdSchema>,
  ) => {
    const { chat_thread_id, message } =
      await appendMessageToChatThreadByIdSchema.parseAsync(params);
    const res = await fetch(
      `/api/chatHistory/appendMessage?chat_thread_id=${chat_thread_id}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(message),
      },
    );

    if (res.status === 401) {
      throw new UnauthenticatedError();
    }

    if (!res.ok) {
      throw new Error("failed add chat message to thread");
    }
  },
);

export const deleteThreadById = getAuthenticatedRoute(
  async (token, params: z.infer<typeof threadByIdSchema>) => {
    const { id } = await threadByIdSchema.parseAsync(params);
    const res = await fetch(`/api/chatHistory/delete?chat_thread_id=${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 401) {
      throw new UnauthenticatedError();
    }

    if (!res.ok) {
      throw new Error("failed to delete chat thread");
    }
  },
);
