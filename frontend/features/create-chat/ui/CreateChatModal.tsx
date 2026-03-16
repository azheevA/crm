"use client";

import { useState } from "react";
import { useChatControllerCreate } from "@/shared/api/endpoints/chat/chat";
import { UserList } from "@/widgets/user-list/ui/UserList";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";

export const CreateChatModal = () => {
  const [members, setMembers] = useState<number[]>([]);
  const [title, setTitle] = useState("");

  const { mutate, isPending } = useChatControllerCreate();

  const toggleUser = (id: number) => {
    setMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleCreate = () => {
    if (!title.trim() || members.length === 0) return;

    mutate({
      data: {
        title,
        memberIds: members,
      },
    });
  };

  return (
    <div
      className="flex flex-col gap-6 p-6 rounded-3xl border border-white/10 
    bg-white/40 dark:bg-zinc-950/50 backdrop-blur-xl shadow-xl"
    >
      <div className="space-y-1">
        <h3 className="text-lg font-semibold tracking-wide text-primary">
          Новый чат
        </h3>
        <p className="text-sm text-muted-foreground">
          Дайте чату название и выберите участников
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="chat-title">Название</Label>
          <Input
            id="chat-title"
            placeholder="Например: Команда разработки"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-xl border-white/20 
            bg-white/40 dark:bg-white/5 
            focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label>Участники</Label>
            <span className="text-xs text-muted-foreground">
              {members.length} выбрано
            </span>
          </div>

          <div
            className="rounded-2xl border border-white/10 
          bg-white/20 dark:bg-black/30 backdrop-blur p-2 max-h-72 overflow-hidden"
          >
            <UserList selected={members} onSelect={toggleUser} />
          </div>
        </div>
      </div>

      <Button
        onClick={handleCreate}
        disabled={isPending || !title.trim() || members.length === 0}
        className="w-full rounded-xl font-medium tracking-wide
        bg-primary text-primary-foreground
        hover:shadow-[0_0_20px_rgba(var(--primary),0.6)]
        transition-all"
      >
        {isPending ? "Создание..." : "Создать чат"}
      </Button>
    </div>
  );
};
