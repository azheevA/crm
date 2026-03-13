"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/shared/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { useAuthControllerSignIn } from "@/shared/api/endpoints/auth/auth";
import { useRouter } from "next/navigation";
import { ROUTES } from "../../model/constant";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/query-keys";

const loginSchema = z.object({
  email: z.string().email("Неверный формат почты"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export const SignInForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useAuthControllerSignIn({
    mutation: {
      onSuccess: async (data) => {
        await queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me });
        router.push(ROUTES.HOME);
        console.log("Успешный вход", data);
      },
      onError: (error) => {
        console.error("Ошибка входа", error);
      },
    },
  });

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ data: values });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Пароль</FormLabel>
                <Link
                  href={ROUTES.FORGOT_PASSWORD}
                  className="text-xs text-zinc-400 hover:text-zinc-500 transition-colors"
                >
                  Забыли пароль?
                </Link>
              </div>
              <FormControl>
                <Input type="password" placeholder="12345" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? "Вход..." : "Войти"}
        </Button>
      </form>
    </Form>
  );
};
