"use client";
import { useForm } from "react-hook-form";
import { useAuthControllerForgotPassword } from "@/shared/api/endpoints/auth/auth";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";

export const ForgotPasswordForm = ({
  onEmailSent,
}: {
  onEmailSent: (email: string) => void;
}) => {
  const form = useForm({ defaultValues: { email: "" } });

  const { mutate, isPending } = useAuthControllerForgotPassword({
    mutation: {
      onSuccess: (_, variables) => {
        onEmailSent(variables.data.email);
      },
    },
  });

  return (
    <form
      onSubmit={form.handleSubmit((data) => mutate({ data }))}
      className="space-y-4"
    >
      <Input
        {...form.register("email")}
        placeholder="Ваш email"
        type="email"
        required
      />
      <Button className="w-full" disabled={isPending}>
        {isPending ? "Отправка..." : "Получить код"}
      </Button>
    </form>
  );
};
