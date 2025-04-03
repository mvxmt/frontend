import { useQuery } from "@tanstack/react-query";
import { getAllChatThreads } from ".";

export const useChatHistoryForUser = () => {
  const query = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      return await getAllChatThreads();
    },
  });

  return query;
};