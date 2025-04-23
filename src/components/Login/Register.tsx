"use client";

import Button from "@/components/Login/Button";
import Input from "@/components/Login/Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { SyntheticEvent, useState } from "react";
import { z } from "zod";
import { registerUser } from "@/utils/register";



const registrationFormModel = z.object({
  name: z.string().nonempty("Name Required"),
  email: z.string().nonempty("Email required").email(),
  password: z.string().nonempty("Password required")
})

type RegisrationFormT = z.infer<typeof registrationFormModel>

export default function Register() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [formError, setFormError] = useState<z.ZodError<RegisrationFormT> | undefined>()
  const [isSuccess, setIsSuccess] = useState(false);

  const registerMutation = useMutation({
    mutationFn: async (data: RegisrationFormT) => {
      return registerUser(data)
    },
    onSuccess: (userData) => {
      if (userData) {
        queryClient.resetQueries()
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          router.replace("/login/")
        }, 3000);
      }
    }
  });

  function handleRegistration(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();


    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const { data, error } = registrationFormModel.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password")
    })

    if (error) {
      setFormError(error)
      e.stopPropagation()
      return
    } else {
      setFormError(undefined)
    }

    registerMutation.mutate(data);
  }

  function handleCancel(e) {
    e.preventDefault();
    router.replace("/")
  }

  return (
    <form onSubmit={handleRegistration}>
      <Input inputName="name" placeholder="Name" type="text" />
      <span className="font-bold font-sans text-red-500">{formError?.format().name?._errors.join("")}</span>

      <Input inputName="email" placeholder="Email Address" type="text" />
      <span className="font-bold font-sans text-red-500">{formError?.format().email?._errors.join("")}</span>

      <Input inputName="password" placeholder="Password" type="password" />
      <span className="font-bold font-sans text-red-500">{formError?.format().password?._errors.join("")}</span>

      <span className="mt-2 font-bold font-sans text-red-500 text-center">{registerMutation.error?.message}</span>

      {isSuccess && (
        <span className="mt-2 italic font-sans text-green-500 text-center">Registration Succesful Please Login To Continue</span>
      )}

      <Button text="Register" />
      <button className="group relative flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 font-sans text-lg font-medium text-secondary hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        onClick={handleCancel}>Cancel</button>
    </form>
  );
}
