"use client";
import { useSession } from "@/entities/user/api/user-session";
import { SignOutButton } from "@/features/auth/ui/SignOut/SignOut";

export const ProfileInfo = () => {
  const { user, isLoading } = useSession();

  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return null;

  return (
    <div className="flex items-center gap-4 p-2 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
      <div className="flex flex-col">
        <span className="text-sm font-medium text-white">{user.id}</span>
        <span className="text-xs text-zinc-400">{user.email}</span>
      </div>
      <SignOutButton />
    </div>
  );
};
