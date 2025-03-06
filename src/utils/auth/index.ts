export const getToken = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);

  const res = await fetch("/api/auth/token", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = (await res.json()) as {detail: string}
    throw Error(err.detail);
  }

  return (await res.json()) as {
    access_token: string;
    token_type: "bearer";
  };
};

export const getUserInfo = async (token: string) => {
  const res = await fetch("/api/auth/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw Error("failed to load user profile");
  }

  return (await res.json()) as {
    name: string;
    email: string;
  };
};
