import { getDefaultStore } from "jotai";
import { resetAuthState, tokenAtom } from "./store";

export class UnauthenticatedError extends Error {}

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

export function getAuthenticatedRoute<T>(
  f: (token: string | undefined) => Promise<T>,
): () => Promise<T>;
export function getAuthenticatedRoute<T, U>(
  f: (token: string | undefined, args: U) => Promise<T>,
): (extra: U) => Promise<T>;
export function getAuthenticatedRoute<T, U>(
  f: (token: string | undefined, args?: U) => Promise<T>,
): (extra?: U) => Promise<T> {
  return async (extra?: U) => {
    const store = getDefaultStore();
    const accessToken = store.get(tokenAtom);

    if (!accessToken) {
      throw new UnauthenticatedError();
    }

    try {
      return await f(accessToken, extra);
    } catch (e) {
      if (e instanceof UnauthenticatedError) {
        const newToken = await refreshToken();
        if (!newToken) {
          throw e;
        }
        return await f(accessToken, extra);
      } else {
        throw e;
      }
    }
  };
}

export const logout = async () => {
  await fetch("/api/auth/logout", { method: "POST" });
  resetAuthState();
};

export const getUserInfo = getAuthenticatedRoute(async (token) => {
  const res = await fetch("/api/auth/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status === 401) {
    throw new UnauthenticatedError();
  }

  if (!res.ok) {
    throw new Error("failed to load user profile");
  }

  return (await res.json()) as {
    name: string;
    email: string;
  };
});
