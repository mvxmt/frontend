import { getAuthenticatedRoute, UnauthenticatedError } from "../auth";
import { z } from "zod";

//USE THIS FOR SETTING AND RETRIEVING USER SETTINGS:
//MODEL
//DISTANCE
//NUMBER OF CHUNKS

export const saveUserSettings = getAuthenticatedRoute(async (token,settings) => {
    const res = await fetch(`/api/settings/save`,{ 
        method:"POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
      },
        body:JSON.stringify(settings)
    });

      if (res.status === 401) {
        throw new UnauthenticatedError();
      }
    
      if (!res.ok) {
        throw new Error("failed to load user profile");
      }
      const json = await res.json()
      return json
});

export const getModelSettings = getAuthenticatedRoute(async (token) => {
    const res = await fetch("/api/settings/get", {
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
    const json = await res.json()
    const settings = zModelSettings.parse(json)
    return settings
  });

  export const getModels = async () => {
    const res = await fetch("/api/chat/models", {
      headers: {
      },
    });

    if (!res.ok) {
      throw new Error("failed to load user profile");
    }
    const json = await res.json()
    return json
  };

export const zModelSettings = z.object({
    model: z.string(),
    distance: z.number(),
    chunks: z.number()
});

export const defaultSettings: ModelSettings = {
  model: "llama3.2:3b",
  distance: 5,
  chunks: 10,
};

export type ModelSettings = z.infer<typeof zModelSettings>;