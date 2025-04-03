import { getAuthenticatedRoute, UnauthenticatedError } from "../auth";


export const getAllUserFiles = getAuthenticatedRoute(async (token) => {
  const res = await fetch("/api/files/retrieve", {
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

  return (await res.json()) as [{
    id: string;
    owner: string;
    filename: string;
  }];
});

//Passes a single parameter
//Otherwise use a json object
//export const getUserFiles = getAuthenticatedRoute(async (token, params: {search:string}) =>

export const deleteUserFile = getAuthenticatedRoute(async (token,params: {id:string}) => {
  const res = await fetch(`/api/files/delete/${params.id}`,{ 
    method:"DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
  },});

  if (res.status === 401) {
    throw new UnauthenticatedError();
  }

  if (!res.ok) {
    throw new Error("failed to load user profile");
  }

  return res.json()
});
