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
import { ThemeSwitcher } from "@/shared/ui/theme-switch";

export function MainMenu() {
  const { data: user, isLoading } = useUserControllerGetMe();

  return (
    <div
      className="
      fixed top-4
      left-1/2 -translate-x-1/2
      z-50
    "
    >
      <Menubar
        className="
        px-3
        bg-white/40 dark:bg-zinc-950/40
        backdrop-blur-xl
        border border-white/10
        rounded-xl
        shadow-xl
      "
      >
        <MenubarMenu>
          <MenubarTrigger asChild>
            <Link href="/" className="px-3 text-sm font-medium">
              Главная
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger asChild>
            <Link href="/chat" className="px-3 text-sm font-medium">
              Чаты
            </Link>
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger asChild>
            <ThemeSwitcher />
          </MenubarTrigger>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="flex items-center gap-2 px-3">
            {isLoading ? (
              <div className="w-6 h-6 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <>
                <Avatar className="w-7 h-7">
                  <AvatarImage
                    src={
                      user.avatar?.url
                        ? `http://localhost:3000${user.avatar.url}`
                        : "/not-avatar.jpg"
                    }
                  />

                  <AvatarFallback>{user.name?.slice(0, 2)}</AvatarFallback>
                </Avatar>

                <span className="text-sm max-w-24 truncate">{user.name}</span>
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Гость</span>
            )}
          </MenubarTrigger>

          <MenubarContent align="end">
            {user ? (
              <>
                <MenubarItem asChild>
                  <Link href="/profile">Профиль</Link>
                </MenubarItem>

                <MenubarItem asChild>
                  <Link href="/profile/settings">Настройки</Link>
                </MenubarItem>

                <MenubarSeparator />

                <SignOutButton />
              </>
            ) : (
              <>
                <MenubarItem asChild>
                  <Link href="/sign-in">Войти</Link>
                </MenubarItem>

                <MenubarItem asChild>
                  <Link href="/sign-up">Регистрация</Link>
                </MenubarItem>
              </>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
}
