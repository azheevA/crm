"use client";

import { useState } from "react";
import { useChatControllerAddMembers } from "@/shared/api/endpoints/chat/chat";
import { UserList } from "@/widget/user-list/ui/UserList";
import { useQueryClient } from "@tanstack/react-query";
interface Props {
  chatId: number;
}

export const AddMembersModal = ({ chatId }: Props) => {
  const [members, setMembers] = useState<number[]>([]);
  const queryClient = useQueryClient();
  const { mutate } = useChatControllerAddMembers();

  const toggleUser = (userId: number) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleAdd = () => {
    mutate(
      {
        chatId: String(chatId),
        data: { memberIds: members },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["chatControllerGetMyChats"],
          });
        },
      },
    );
  };

  return (
    <div className="p-4 border rounded bg-white">
      <h2>Добавить участников</h2>

      <UserList selected={members} onSelect={toggleUser} />

      <button
        onClick={handleAdd}
        className="mt-3 bg-green-500 text-white px-3 py-1"
      >
        Добавить
      </button>
    </div>
  );
};
