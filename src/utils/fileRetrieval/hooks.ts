import { useQuery } from "@tanstack/react-query"
import { getAllUserFiles } from ".";

export const useFileInfoForUser = () => {
  const query = useQuery({
    queryKey: ["userFiles"],
    queryFn: async () => {
      return getAllUserFiles();
    },
  });
  return query;
};
