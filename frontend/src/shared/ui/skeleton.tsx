import { cn } from "@/src/shared/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-xl bg-linear-to-r from-muted/20 via-primary/5 to-muted/20 bg-size-[200%_100%]",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
