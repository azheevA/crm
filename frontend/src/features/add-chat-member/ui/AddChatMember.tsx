"use client";

import { useState } from "react";
import { useChatControllerAddMembers } from "@/src/shared/api/endpoints/chat/chat";
import { UserList } from "@/src/widgets/user-list/ui/UserList";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/src/shared/lib/utils";
import { Button } from "@/src/shared/ui/button";
import { XIcon } from "lucide-react";

interface Props {
  chatId: number;
  onClose: () => void;
}
export const AddMembersModal = ({ chatId, onClose }: Props) => {
  const [members, setMembers] = useState<number[]>([]);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useChatControllerAddMembers({
    mutation: {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["chatControllerGetMyChats"],
        });
        setMembers([]);
        onClose();
      },
    },
  });

  const toggleUser = (userId: number) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAdd = () => {
    if (members.length === 0) return;
    mutate({
      chatId: String(chatId),
      data: { memberIds: members },
    });
  };

  return (
    <div
      className={cn(
        "relative p-6 min-w-87.5 space-y-4",
        "rounded-3xl border border-white/10",
        "bg-white/10 dark:bg-zinc-950/80 backdrop-blur-2xl",
        "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-white"
      >
        <XIcon size={20} />
      </button>

      <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/70 px-1">
        Добавить участников
      </h2>

      <div className="max-h-100 overflow-y-auto pr-1 custom-scrollbar">
        <UserList selected={members} onSelect={toggleUser} />
      </div>

      <Button
        onClick={handleAdd}
        disabled={isPending || members.length === 0}
        className={cn(
          "w-full mt-4 py-3 px-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300",
          "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)]",
          "hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          isPending && "animate-pulse",
        )}
      >
        {isPending ? "Добавление..." : `Добавить выбранных (${members.length})`}
      </Button>
    </div>
  );
};
