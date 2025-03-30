import { getDefaultStore } from "jotai";
import { resetAuthState, tokenAtom } from "./store";

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
    const err = (await res.json()) as { detail: string };
    throw Error(err.detail);
  }

  const data = (await res.json()) as {
    access_token: string;
    token_type: "bearer";
  };

  const store = getDefaultStore();
  store.set(tokenAtom, data.access_token);
};

export const refreshToken = async () => {
  const store = getDefaultStore();
  const res = await fetch("/api/auth/refresh", {
    method: "POST",
  });

  if (!res.ok) {
    resetAuthState();
    return;
  }

  const token = (await res.json()) as {
    access_token: string;
    token_type: "bearer";
  };

  store.set(tokenAtom, token.access_token);
  return token;
};

export const getAuthenticatedRoute =
  <T>(f: (token: string | undefined) => Promise<T>): (() => Promise<T>) =>
  async () => {
    const store = getDefaultStore();
    const accessToken = store.get(tokenAtom);

    try {
      return f(accessToken);
    } catch {
      const newToken = await refreshToken();
      if (!newToken) {
        throw new Error("Unauthenticated");
      }
      return f(newToken.access_token);
    }
  };

export const getAccessToken = async (): Promise<string> => {
  const store = getDefaultStore();
  const accessToken = store.get(tokenAtom);

  // Try to use the token, if invalid throw
  const res = await fetch("/api/auth/users/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status == 401) {
    const newToken = await refreshToken();
    if (!newToken) {
      throw new Error("Unauthenticated");
    }
    return getAccessToken();
  }

  return accessToken!;
};

export const logout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  resetAuthState();
};

export const getUserInfo = getAuthenticatedRoute(async (t) => {
  const res = await fetch("/api/auth/users/me", {
    headers: {
      Authorization: `Bearer ${t}`,
    },
  });

  if (!res.ok) {
    throw Error("failed to load user profile");
  }

  return (await res.json()) as {
    name: string;
    email: string;
  };
});
