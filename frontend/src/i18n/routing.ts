import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ru", "en"],
  defaultLocale: "ru",
  pathnames: {
    "/": "/",
    "/chat": "/chat",
    "/profile": "/profile",
    "/profile/settings": "/profile/settings",
    "/sign-in": "/sign-in",
    "/sign-up": "/sign-up",
    "/chat/[id]": "/chat/[id]",
    "/pathnames": {
      ru: "/puti",
      en: "/pathnames",
    },
  },
});
