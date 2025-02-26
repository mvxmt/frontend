"use client";

import { AnimatePresence, motion } from "motion/react";
import { useOptimistic, useRef, useState } from "react";
import Header from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import FormAction from "@/components/FormAction";

export default function Login() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    formData.get("change") as string;
  };

  const [value,setValue] = useState("");
  const handleChange =(e)=> {
        setValue(e.target.value);
    }

  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet?"
        linkName="Signup"
        linkUrl="#"
      />
      <div className="flex-col w-80 justify-center items-center ">
        <LoginForm
          ref={formRef}
          change={handleChange}
          inputName="email"
          placeholder="Email Address"
          type="text"
        ></LoginForm>
        <LoginForm
          ref={formRef}
          submit={handleSubmit}
          inputName="password"
          placeholder="Password"
          type="password"
        ></LoginForm>
        <FormAction handeSubmit={handleSubmit} text="Login"/>
        <div className="text-white">INPUT: {value}</div>
      </div>
    </div>
  );
}
