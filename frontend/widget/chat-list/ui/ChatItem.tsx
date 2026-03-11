import Link from "next/link";

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
  return (
    <Link
      href={`/chat/${chat.id}`}
      className="p-4 border-b hover:bg-gray-100 cursor-pointer"
    >
      <div className="font-semibold">{chat.title ?? "Чат"}</div>

      <div className="text-sm text-gray-500 truncate">
        {chat.lastMessage?.text ?? "Нет сообщений"}
      </div>
    </Link>
  );
};
