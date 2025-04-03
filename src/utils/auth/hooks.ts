import { useQuery } from "@tanstack/react-query";
import { getUserInfo } from ".";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "./store";

export const useUserInfo = () => {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      return getUserInfo();
    },
    enabled: isAuthenticated
  });

  return query;
};
