import { useMutation } from '@tanstack/react-query';
import { uploadFile } from ".";

export const useUploadFileMutation = () => {
    return useMutation({
        mutationFn: ({ file } : {file: File}) => uploadFile({ file }),
    });
};