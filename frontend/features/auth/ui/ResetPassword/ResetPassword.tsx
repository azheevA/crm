"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuthControllerResetPasswordConfirm } from "@/shared/api/endpoints/auth/auth";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../model/constant";

interface ResetPasswordFormValues {
  code: string;
  newPassword: string;
  confirmPassword: string;
}

export const ResetPasswordForm = ({ email }: { email: string }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const route = useRouter();
  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
    mode: "onChange",
  });

  const { mutate, isPending } = useAuthControllerResetPasswordConfirm({
    mutation: {
      onSuccess: () => (
        alert("Пароль успешно изменен!"),
        route.push(ROUTES.SIGN_IN)
      ),
      onError: (err) => console.error("Ошибка сброса:", err),
    },
  });

  const onSubmit: SubmitHandler<ResetPasswordFormValues> = (data) => {
    if (step === 1) {
      setStep(2);
      return;
    }
    mutate({
      data: {
        email,
        code: data.code,
        newPassword: data.newPassword,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">
          {step === 1 ? "Подтверждение почты" : "Новый пароль"}
        </h2>
        <p className="text-sm text-zinc-400">
          {step === 1 ? (
            <>
              Код отправлен на{" "}
              <span className="text-white font-medium">{email}</span>
            </>
          ) : (
            "Придумайте надежный пароль для вашего аккаунта"
          )}
        </p>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <Input
            {...register("code", {
              required: "Введите код",
              minLength: { value: 6, message: "Код должен быть из 6 символов" },
            })}
            placeholder="6-значный код"
            maxLength={6}
            className="text-center tracking-[0.5em] font-mono text-lg"
          />
          {errors.code && (
            <p className="text-red-500 text-xs">{errors.code.message}</p>
          )}

          <Button type="submit" className="w-full">
            Подтвердить код
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("newPassword", {
                required: "Введите пароль",
                minLength: { value: 6, message: "Минимум 6 символов" },
                onChange: () => {
                  if (getValues("confirmPassword")) {
                    trigger("confirmPassword");
                  }
                },
              })}
              type="password"
              placeholder="Новый пароль"
            />
            {errors.newPassword && (
              <p className="text-red-500 text-xs">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("confirmPassword", {
                required: "Подтвердите пароль",
                validate: (value) => {
                  const password = getValues("newPassword");
                  return value === password || "Пароли не совпадают";
                },
              })}
              type="password"
              placeholder="Повторите пароль"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => setStep(1)}
              disabled={isPending}
            >
              Назад
            </Button>
            <Button className="flex-1" disabled={isPending}>
              {isPending ? "Сохранение..." : "Обновить пароль"}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};
