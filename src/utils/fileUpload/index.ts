import { getAuthenticatedRoute, UnauthenticatedError } from "../auth";

export const uploadFile = getAuthenticatedRoute(async (token, params: {file: File}) => {
    const formData = new FormData();
    formData.append("src_file", params.file);

    const res = await fetch(`/api/file/upload`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
    },
        body: formData
});

    if (res.status === 401) {
        throw new UnauthenticatedError();
    }

    if (!res.ok) {
        throw new Error("failed to upload file")
    }

    return res.json()
});

