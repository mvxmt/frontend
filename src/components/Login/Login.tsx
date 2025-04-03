"use client";

import Button from "@/components/Login/Button";
import Input from "@/components/Login/Input";
import { getToken } from "@/utils/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { z } from "zod";

const loginFormModel = z.object({
  username: z.string().nonempty("Username required").email(),
  password: z.string().nonempty("Password required")
})

type LoginFormT = z.infer<typeof loginFormModel>

export default function Login() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<z.ZodError<LoginFormT> | undefined>()

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormT) => {
      getToken(data);
    },
    onSuccess() {
      queryClient.resetQueries()
      router.replace("/")
    }
  });

  function handleLogin(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const {data, error} = loginFormModel.safeParse({
      username: formData.get("email"),
      password: formData.get("password")
    })

    if(error) {
      setFormError(error)
      e.stopPropagation()
      return
    } else {
      setFormError(undefined)
    }

    loginMutation.mutate(data);
  }

  return (
    <form onSubmit={handleLogin}>
      <Input inputName="email" placeholder="Email Address" type="text" />
      <span className="font-bold font-sans text-red-500">{formError?.format().username?._errors.join("")}</span>
      <Input inputName="password" placeholder="Password" type="password" />
      <span className="font-bold font-sans text-red-500">{formError?.format().password?._errors.join("")}</span>
      <span className="mt-2 font-bold font-sans text-red-500 text-center">{loginMutation.error?.message}</span>
      <Button text="Login" />
    </form>
  );
}
