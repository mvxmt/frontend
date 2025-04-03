import { getAuthenticatedRoute, UnauthenticatedError } from "../auth";

export const getAllChatHistory = getAuthenticatedRoute(async (token) => {
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

  return (await res.json()) as [{
    id: string;
    name: string;
  }];
});