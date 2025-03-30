import { atom, getDefaultStore } from "jotai";

export const tokenAtom = atom<string | undefined>()
export const isAuthenticatedAtom = atom((get) => typeof get(tokenAtom) !== "undefined")

export const resetAuthState = () => {
    const store = getDefaultStore();
    store.set(tokenAtom, undefined);
}