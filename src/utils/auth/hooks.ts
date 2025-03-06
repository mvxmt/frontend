import { useStore } from "jotai";
import { tokenAtom } from "./store";
import { getUserInfo } from ".";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {
  const store = useStore();
  
  const query = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
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
