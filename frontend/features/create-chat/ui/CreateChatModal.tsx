"use client";

import { useState } from "react";
import { useChatControllerCreate } from "@/shared/api/endpoints/chat/chat";
import { UserList } from "@/widgets/user-list/ui/UserList";

export const CreateChatModal = () => {
  const [members, setMembers] = useState<number[]>([]);
  const [title, setTitle] = useState("");

  const { mutate } = useChatControllerCreate();

  const toggleUser = (id: number) => {
    setMembers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
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
    <div className="p-4">
      <input
        className="border p-2 w-full"
        placeholder="Название чата"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <UserList selected={members} onSelect={toggleUser} />

      <button
        onClick={handleCreate}
        className="mt-3 bg-blue-500 text-white px-3 py-1"
      >
        Создать
      </button>
    </div>
  );
};
