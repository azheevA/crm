"use client";

import { SignOutButton } from "@/features/auth/ui";
import { useUserControllerGetMe } from "@/shared/api/endpoints/users/users";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/shared/ui/menubar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import Link from "next/link";

export function MainMenu() {
  const { data: user, isLoading } = useUserControllerGetMe({
    query: {
      staleTime: 0,
      gcTime: 0,
    },
  });

  return (
    <div className="fixed top-0 z-50 flex w-full justify-center p-4">
      <Menubar className="border-white/20 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/70 shadow-xl">
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer font-medium" asChild>
            <Link href="/">Главная</Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer font-medium" asChild>
            <Link href="/chat">Сообщения</Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer flex items-center gap-2 px-3 transition-all hover:opacity-80">
            {isLoading ? (
              <div className="w-6 h-6 rounded-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            ) : user ? (
              <>
                <Avatar className="w-7 h-7 border border-blue-500/20 shadow-sm">
                  <AvatarImage
                    src={
                      user?.avatar?.url
                        ? `http://localhost:3000${user.avatar.url}`
                        : "/not-avatar.jpg"
                    }
                  />
                  <AvatarFallback className="text-[10px] bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    {(user.name?.slice(0, 2) || "??").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-zinc-800 dark:text-zinc-100 max-w-25 truncate">
                  {user.name || "Профиль"}
                </span>
              </>
            ) : (
              <span className="font-medium text-zinc-600 dark:text-zinc-400">
                Аккаунт
              </span>
            )}
          </MenubarTrigger>

          <MenubarContent align="end" className="min-w-50">
            {user ? (
              <>
                <div className="flex items-center gap-3 px-3 py-3 mb-1 bg-zinc-50 dark:bg-zinc-900/50 rounded-t-md">
                  <Avatar className="w-10 h-10 border border-zinc-200 dark:border-zinc-700">
                    <AvatarImage
                      src={
                        user?.avatar?.url
                          ? `http://localhost:3000${user.avatar.url}`
                          : "/not-avatar.jpg"
                      }
                    />
                    <AvatarFallback>{user.name?.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold truncate">
                      {user.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 truncate">
                      {user.email}
                    </span>
                  </div>
                </div>

                <MenubarSeparator />

                <MenubarItem asChild className="cursor-pointer">
                  <Link href="/profile" className="flex w-full items-center">
                    Личный кабинет
                  </Link>
                </MenubarItem>

                <MenubarItem asChild className="cursor-pointer">
                  <Link
                    href="/profile/settings"
                    className="flex w-full items-center"
                  >
                    Настройки
                  </Link>
                </MenubarItem>

                <MenubarSeparator />
                <div className="p-1">
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <MenubarItem asChild>
                  <Link href="/sign-in" className="w-full">
                    Вход
                  </Link>
                </MenubarItem>
                <MenubarItem asChild>
                  <Link
                    href="/sign-up"
                    className="w-full font-bold text-blue-600"
                  >
                    Регистрация
                  </Link>
                </MenubarItem>
              </>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
