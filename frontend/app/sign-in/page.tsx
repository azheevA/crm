import { SignInForm } from "@/features/auth/ui";

function page() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />

      <div className="w-full max-w-112.5 space-y-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Авторищация
          </h1>
        </div>

        <div className="relative rounded-3xl border border-white/20 bg-white/40 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-800/50 dark:bg-zinc-950/40">
          <SignInForm />
        </div>
      </div>
    </div>
  );
}

export default page;
