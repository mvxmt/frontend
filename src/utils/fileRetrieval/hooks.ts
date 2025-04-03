import { useMutation, useQuery } from "@tanstack/react-query"
import { deleteUserFile, getAllUserFiles } from ".";

export const useFileInfoForUser = () => {
  const query = useQuery({
    queryKey: ["userFiles"],
    queryFn: async () => {
      return getAllUserFiles();
    },
  });
  return query;
};

export const useDeleteFileMutation = () =>{
  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteUserFile({ id }),
  });
};