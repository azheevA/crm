"use client";

import { useRouter } from "next/navigation";
import { useAuthControllerSignOut } from "@/shared/api/endpoints/auth/auth";
import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";
import { ROUTES } from "../../model/constant";

export const SignOutButton = () => {
  const router = useRouter();

  const { mutate: signOut, isPending } = useAuthControllerSignOut({
    mutation: {
      onSuccess: () => {
        router.push(ROUTES.SIGN_IN);
        console.log("Успешный выход");
      },
      onError: (err) => {
        console.error("Ошибка при выходе:", err);
      },
    },
  });

  return (
    <Button
      variant="ghost"
      disabled={isPending}
      onClick={() => signOut()}
      className="gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive transition-all rounded-xl"
    >
      <LogOut className="size-4" />
      {isPending ? "Выход..." : "Выйти"}
    </Button>
  );
};
