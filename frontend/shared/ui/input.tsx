"use client";

import * as React from "react";
import { cn } from "@/shared/lib/utils";
import { Eye, EyeOff } from "lucide-react";
interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean;
}

function Input({ className, type, ...props }: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const isPassword = type === "password";

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="relative w-full">
      <input
        type={isPassword && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "flex h-10 w-full rounded-xl border bg-white/40 dark:bg-zinc-950/40 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 backdrop-blur-md transition-all",
          "border-white/20 dark:border-zinc-800/50 shadow-sm focus:shadow-md focus:bg-white/60 dark:focus:bg-zinc-950/60",
          "aria-invalid:border-destructive/50 dark:aria-invalid:border-red-500/50",
          isPassword && "pr-10",
          className,
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      )}
    </div>
  );
}

export { Input };
