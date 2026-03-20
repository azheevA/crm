"use client";
import * as React from "react";
import { cn } from "@/src/shared/lib/utils";
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
    <div className="relative w-full group">
      <input
        type={isPassword && showPassword ? "text" : type}
        data-slot="input"
        className={cn(
          "flex h-11 w-full rounded-xl border bg-white/5 dark:bg-zinc-950/20 px-4 py-2 text-sm transition-all duration-300 backdrop-blur-xl",
          "border-white/10 dark:border-zinc-800/50",
          "placeholder:text-muted-foreground/50",
          "focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 focus:bg-white/10 dark:focus:bg-zinc-950/40",
          "hover:border-white/20 dark:hover:border-zinc-700",
          "aria-invalid:border-destructive/50 aria-invalid:ring-destructive/20",
          " shadow-black/30 shadow-md border-t border-black/20 dark:shadow-white/20 dark:border-white/20",
          isPassword && "pr-11",
          className,
        )}
        {...props}
      />
      {isPassword && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-primary transition-colors p-1"
        >
          {showPassword ? (
            <EyeOff className="size-4 animate-in fade-in" />
          ) : (
            <Eye className="size-4 animate-in fade-in" />
          )}
        </button>
      )}
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-primary/0 to-transparent group-focus-within:via-primary/50 transition-all duration-500" />
    </div>
  );
}

export { Input };
