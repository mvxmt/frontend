"use client";

import Header from "@/components/Login/Header";
import Register from "@/components/Login/Register";

export default function RegistrationPage() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-background">
      <Header
        heading="Create an Account"
        paragraph="Sign up for a new account."
        linkName=""
        linkUrl="#"
      />
      <div className="w-80 flex-col items-center justify-center">
        <Register />
      </div>
    </div>
  );
}
