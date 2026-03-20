"use client";

import { useLocale } from "next-intl";
import { Globe, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/src/i18n/navigation";
import { cn } from "@/src/shared/lib/utils";
import { useParams } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const switchLocale = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value as "en" | "ru";
    if (newLocale !== locale) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.replace({ pathname, params } as any, { locale: newLocale });
    }
  };

  return (
    <div className="relative inline-flex items-center group">
      <Globe className="absolute left-3.5 size-4 text-muted-foreground/50 group-hover:text-primary transition-colors z-10 pointer-events-none" />

      <select
        value={locale}
        onChange={switchLocale}
        className={cn(
          "appearance-none  w-full rounded-xl border  pl-10 pr-10 py-2 text-sm transition-all duration-300 backdrop-blur-xl cursor-pointer",
          "",
          "text-foreground/80",

          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-white/10 dark:focus:bg-zinc-950/40",
          "hover:border-white/20 dark:hover:border-zinc-700",
        )}
      >
        <option
          value="en"
          className="dark:bg-zinc-900 dark:text-white text-black"
        >
          EN
        </option>
        <option
          value="ru"
          className="dark:bg-zinc-900 dark:text-white text-black"
        >
          RU
        </option>
      </select>
      <ChevronDown className="absolute right-3 size-4 text-muted-foreground/50 group-hover:text-primary transition-colors pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/0 to-transparent group-focus-within:via-primary/50 transition-all duration-500" />
    </div>
  );
}
