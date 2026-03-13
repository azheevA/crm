"use client";

import { useUserControllerGetMe } from "@/shared/api/endpoints/users/users";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { SignOutButton } from "@/features/auth/ui";
import { Mail, User, ShieldCheck, Calendar, Settings2 } from "lucide-react";
import Link from "next/link";
import { ProfileAvatar } from "@/features/change-user-data/ui/ProfileAvatar";

export default function ProfilePage() {
  const { data: user, isLoading } = useUserControllerGetMe({
    query: {
      staleTime: 0,
      gcTime: 0,
    },
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Вы не авторизованы</h1>
        <Button asChild>
          <Link href="/sign-in">Войти в аккаунт</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-linear-to-r from-blue-600 to-indigo-600 opacity-10 dark:opacity-20" />

          <div className="relative px-8 pt-16 pb-8 flex flex-col md:flex-row items-center md:items-end gap-6">
            <ProfileAvatar user={user} />

            <div className="flex-1 text-center md:text-left space-y-1">
              <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
                {user.name || "Пользователь"}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 flex items-center justify-center md:justify-start gap-2 text-sm">
                <Mail className="size-4" /> {user.email}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl gap-2"
                asChild
              >
                <Link href="/profile/settings">
                  <Settings2 className="size-4" /> Настройки
                </Link>
              </Button>
            </div>
          </div>
        </section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800">
              <CardHeader>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <ShieldCheck className="size-4 text-blue-500" /> Статус
                  аккаунта
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">Роль:</span>
                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase">
                    User
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">ID:</span>
                  <span className="font-mono text-xs opacity-60 truncate max-w-25">
                    {user.id}
                  </span>
                </div>
              </CardContent>
            </Card>

            <div className="p-1">
              <SignOutButton />
            </div>
          </div>
          <div className="md:col-span-2 space-y-6">
            <Card className="rounded-3xl border-zinc-200 dark:border-zinc-800 h-full">
              <CardHeader>
                <CardTitle>Данные пользователя</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                      Имя пользователя
                    </label>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                      <User className="size-4 opacity-40" />
                      <span>{user.name || "Не указано"}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                      Дата регистрации
                    </label>
                    <div className="p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                      <Calendar className="size-4 opacity-40" />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-sm text-zinc-500">
                    Это ваша персональная страница. Здесь вы можете управлять
                    своими данными и настройками безопасности.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
