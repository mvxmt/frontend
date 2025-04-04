import { getAuthenticatedRoute, UnauthenticatedError } from "../auth"

export const uploadFile = getAuthenticatedRoute(async (token, params: {file: File}) => {
    const res = await fetch("api/file/upload", {
        method: "POST",
        body: params.file,
        headers: {
            Authorization: 'Bearer ${token}',
        },
    });

    if (res.status === 401) {
        throw new UnauthenticatedError();
    }

    if (!res.ok) {
        throw new Error("failed to upload file")
    }

    return res.json()
});