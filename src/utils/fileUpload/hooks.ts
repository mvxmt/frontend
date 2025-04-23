import { useMutation } from "@tanstack/react-query";
import { uploadFile } from ".";

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => await uploadFile({ file }),
  });
};
