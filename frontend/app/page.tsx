import { Button } from "@/shared/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
        <Link href="/sign-up">
          <Button>Sign Up</Button>
        </Link>
      </main>
    </div>
  );
}
