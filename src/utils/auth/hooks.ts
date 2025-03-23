import { getDefaultStore } from "jotai";
import { tokenAtom } from "./store";
import { getUserInfo } from ".";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {
  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const store = getDefaultStore()
      const token = store.get(tokenAtom);
      if (!token) {
        throw new Error("Unauthenticated")
      }
      return getUserInfo(token);
    },
    retry: false
  });

  return query;
};
