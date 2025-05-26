import { useMutation, useQuery } from "@tanstack/react-query"

export const useSettingsMutation = () =>{
  return useMutation({
    //mutationFn: ({ id }: { id: string }) => deleteUserFile({ id }),
  });
};