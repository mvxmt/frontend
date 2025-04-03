import { useQuery } from "@tanstack/react-query";
import { getAllChatHistory } from ".";

export const useChatHistoryForUser = () => {
  const query = useQuery({
    queryKey: ["chatHistory"],
    queryFn: async () => {
      return await getAllChatHistory();
    },
  });

  return query;
};