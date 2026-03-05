import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email("Неверный формат почты"),
    name: z.string().min(2, "Имя слишком короткое"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
