"use client";
import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cn } from "@/shared/lib/utils";

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex shrink-0 overflow-hidden rounded-full select-none transition-all duration-300",
        "size-8 data-[size=lg]:size-12 data-[size=sm]:size-6",
        "ring-1 ring-primary/20 hover:ring-primary/50 hover:scale-105",
        "shadow-[0_0_10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(var(--primary),0.15)]",
        "after:absolute after:inset-0 after:rounded-full after:ring-1 after:ring-inset after:ring-white/10",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  src,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      src={src === "" ? undefined : src}
      className={cn("aspect-square size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full text-sm font-medium uppercase tracking-tighter",
        "bg-linear-to-br from-muted/50 to-muted/80 backdrop-blur-md",
        "text-muted-foreground group-data-[size=sm]/avatar:text-[10px]",
        "border border-white/5",
        className,
      )}
      {...props}
    />
  );
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full select-none",
        "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)] ring-2 ring-background",
        "group-data-[size=sm]/avatar:size-2",
        "group-data-[size=default]/avatar:size-3",
        "group-data-[size=lg]/avatar:size-3.5",
        "after:absolute after:inset-0 after:rounded-full after:animate-pulse after:bg-white/40",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-3 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        "hover:-space-x-1 transition-all duration-500",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full ring-2 ring-background select-none",
        "bg-muted/40 backdrop-blur-sm text-xs font-bold text-muted-foreground",
        "group-has-data-[size=lg]/avatar-group:size-12 group-has-data-[size=sm]/avatar-group:size-6",
        "border border-white/5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
};
