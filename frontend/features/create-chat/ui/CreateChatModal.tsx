"use client";

import { useState } from "react";
import { useChatControllerCreate } from "@/shared/api/endpoints/chat/chat";
import { UserList } from "@/widget/user-list/ui/UserList";

export const CreateChatModal = () => {
  const [title, setTitle] = useState("");
  const [members, setMembers] = useState<number[]>([]);

  const { mutate } = useChatControllerCreate();

  const toggleUser = (userId: number) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreate = () => {
    mutate({
      data: {
        title,
        memberIds: members,
      },
    });
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h2 className="font-semibold mb-2">Создать чат</h2>

      <input
        placeholder="Название"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 w-full mb-3"
      />

      <UserList selected={members} onSelect={toggleUser} />

      <button
        onClick={handleCreate}
        className="mt-3 bg-blue-500 text-white px-3 py-1 rounded"
      >
        Создать
      </button>
    </div>
  );
};
