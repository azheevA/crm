"use client";

import { useUserControllerGetMe } from "@/shared/api/endpoints/users/users";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { ChatResponseDto } from "@/shared/api/model";

interface Props {
  chat: ChatResponseDto;
}

export const ChatItem = ({ chat }: Props) => {
  const { data: me } = useUserControllerGetMe();
  const params = useParams();

  const active = Number(params?.id) === chat.id;

  const otherMember = chat.members?.find((m) => m.id !== me?.id);

  const displayTitle = chat.isGroup ? chat.title : otherMember?.name || "Чат";

  const displayAvatar = otherMember?.avatar?.url
    ? `http://localhost:3000${otherMember.avatar.url}`
    : null;

  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "flex items-center gap-3 p-3 transition-all hover:bg-zinc-100",
        active && "bg-zinc-100 shadow-sm",
      )}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 border">
          <AvatarImage src={displayAvatar ?? ""} className="object-cover" />
          <AvatarFallback>
            {displayTitle?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-semibold text-sm truncate pr-2">
            {displayTitle}
          </span>
        </div>
      </div>
    </Link>
  );
};
