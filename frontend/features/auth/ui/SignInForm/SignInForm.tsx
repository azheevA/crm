"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const loginSchema = z.object({
  email: z.string().email("Неверный формат почты"),
  password: z.string().min(6, "Минимум 6 символов"),
});

export const SignInForm = () => {
  const { mutate, isPending } = useAuthControllerSignIn({
    mutation: {
      onSuccess: (data) => {
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
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
