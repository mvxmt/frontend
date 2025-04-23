export const registerUser = async (body) => {
    const formData = new FormData()
    formData.append("name", body.name);
    formData.append("email", body.email)
    formData.append("password", body.password)

    const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData
    });

    if (!res.ok) {
        throw new Error("failed to register account");
    }

    if (res.ok){
        return body
    }
};