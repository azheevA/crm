"use client";
import { useTheme } from "next-themes";
import { Button } from "./button";
import { useHasMounted } from "../lib/use-has-mounted";
import { SunIcon, MoonIcon } from "lucide-react";

export const ThemeSwitcher = () => {
  const hasMounted = useHasMounted();
  const { theme, setTheme } = useTheme();

  if (!hasMounted) return <div className="w-10 h-10" />;

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
};
