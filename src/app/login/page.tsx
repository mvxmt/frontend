"use client";

import Header from "@/components/Login/Header";
import Login from "@/components/Login/Login";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <Header
        heading="Login to your account"
        paragraph="Don't have an account yet?"
        linkName="Signup"
        linkUrl="#"
      />
      <div className="w-80 flex-col items-center justify-center">
        <Login />
      </div>
    </div>
  );
}
