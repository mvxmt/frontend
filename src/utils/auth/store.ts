import { atom, getDefaultStore } from "jotai";

export const tokenAtom = atom<string | undefined>()
export const isAuthenticatedAtom = atom((get) => typeof get(tokenAtom) !== "undefined")

export const resetAuthState = () => {
    const store = getDefaultStore();
    store.set(tokenAtom, undefined);
}

declare global {
    interface Window {
        invalidateToken: () => void
    }
}

if(typeof window != "undefined" && process.env.NODE_ENV === "development") {
    window.invalidateToken = () => {
        const store = getDefaultStore()
        store.set(tokenAtom, "ijdiwejdeowidjwoidjwioeodjiweoj")
    }
}