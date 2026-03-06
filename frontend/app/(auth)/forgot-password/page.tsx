"use client";
import { ForgotPasswordForm, ResetPasswordForm } from "@/features/auth/ui";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-100 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
        <h1 className="mb-6 text-2xl font-bold text-center">Восстановление</h1>

        {!email ? (
          <ForgotPasswordForm onEmailSent={setEmail} />
        ) : (
          <ResetPasswordForm email={email} />
        )}
      </div>
    </div>
  );
}
