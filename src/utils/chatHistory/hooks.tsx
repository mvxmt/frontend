import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteThreadById, getAllChatThreads, renameThreadById } from ".";

export const useChatHistoryForUser = () => {
  const query = useQuery({
    queryKey: ["chatHistory"],
    queryFn: getAllChatThreads,
  });

  return query;
};

export const useDeleteChatThread = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteThreadById,
    onSuccess: () => {qc.invalidateQueries({queryKey: ["chatHistory"]})}
  })
}

export const useRenameChatThread = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: renameThreadById,
    onSuccess: () => {qc.invalidateQueries({queryKey: ["chatHistory"]})}
  })
}