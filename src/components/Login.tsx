"use client";

import Input from "@/components/Input";
import Button from "@/components/Button";
import { FormHTMLAttributes } from "react";

export default function Login() {
  function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }
  return (
    <form method="post" onSubmit={handleLogin}>
      <Input inputName="email" placeholder="Email Address" type="text" />
      <Input inputName="password" placeholder="Password" type="password" />
      <Button text="Login" />
    </form>
  );
}
//Wrap input and button in form and make button of type submit
//Hydration Issue - Fix on tylers branch, overrides to run on client instead of server
