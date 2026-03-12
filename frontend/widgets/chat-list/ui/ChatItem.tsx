"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

interface Props {
  chat: {
    id: number;
    title?: string | null;
    lastMessage?: {
      text?: string | null;
    };
  };
}

export const ChatItem = ({ chat }: Props) => {
  const params = useParams();
  const active = Number(params?.id) === chat.id;

  return (
    <Link
      href={`/chat/${chat.id}`}
      className={`block p-4 border-b hover:bg-gray-100 ${
        active ? "bg-gray-200" : ""
      }`}
    >
      <div className="font-semibold">{chat.title ?? "Чат"}</div>

      <div className="text-sm text-gray-500 truncate">
        {chat.lastMessage?.text ?? "Нет сообщений"}
      </div>
    </Link>
  );
};
