import { SignOutButton } from "@/features/auth/ui";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/shared/ui/menubar";
import Link from "next/link";

export function MainMenu() {
  return (
    <div className="fixed top-0 z-50 flex w-full justify-center p-4">
      <Menubar className="border-white/20 bg-white/70 backdrop-blur-md dark:border-zinc-800/50 dark:bg-black/70 shadow-xl">
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
            <MenubarItem>New Window</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Share</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer font-medium text-blue-600 dark:text-blue-400">
            <Link href="/" className="w-full">
              Главная
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer font-medium text-blue-600 dark:text-blue-400">
            <Link href="/chat" className="w-full">
              Сообщения
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="cursor-pointer font-medium text-blue-600 dark:text-blue-400">
            Аккунт
          </MenubarTrigger>
          <MenubarContent>
            <MenubarItem asChild>
              <Link href="/sign-in" className="w-full">
                Авторизация
              </Link>
            </MenubarItem>
            <MenubarItem asChild>
              <Link href="/sign-up" className="w-full font-semibold">
                Регистрация
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <SignOutButton />
      </Menubar>
    </div>
  );
}
