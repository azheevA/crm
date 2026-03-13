"use client";

import { useRouter } from "next/navigation";
import { useAuthControllerSignOut } from "@/shared/api/endpoints/auth/auth";
import { Button } from "@/shared/ui/button";
import { LogOut } from "lucide-react";
import { ROUTES } from "../../model/constant";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/shared/api/query-keys";

export const SignOutButton = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate: signOut, isPending } = useAuthControllerSignOut({
    mutation: {
      onSuccess: async () => {
        queryClient.setQueryData(QUERY_KEYS.me, null);
        queryClient.clear();
        router.push(ROUTES.SIGN_IN);
        router.refresh();
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
