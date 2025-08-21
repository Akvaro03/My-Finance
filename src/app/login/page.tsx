"use client";

import BackgroundDecoration from "@/components/BackgroundDecoration";
import FormLogin from "@/components/forms/FormLogin";
import FormSign from "@/components/forms/FormSign";
import { useState } from "react";

export default function Page() {
  const [state, setState] = useState<"login" | "sign">("login");
  const switchState = () => {
    setState(state === "login" ? "sign" : "login");
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background decoration */}
      <BackgroundDecoration />

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Finance</h1>
          <p className="text-slate-400">Your financial journey starts here</p>
        </div>
        {state === "login" ? (
          <FormLogin goToSign={switchState} />
        ) : (
          <FormSign goToLogin={switchState} />
        )}
      </div>
    </div>
  );
}
