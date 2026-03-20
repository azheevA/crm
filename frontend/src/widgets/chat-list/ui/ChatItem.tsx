"use client";
import { useUserControllerGetMe } from "@/src/shared/api/endpoints/users/users";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/shared/ui/avatar";
import { useParams } from "next/navigation";
import { cn } from "@/src/shared/lib/utils";
import { ChatResponseDto } from "@/src/shared/api/model";
import { Link } from "@/src/i18n/navigation";

interface Props {
  chat: ChatResponseDto;
}

export const ChatItem = ({ chat }: Props) => {
  const { data: me } = useUserControllerGetMe();
  const params = useParams();

  const active = Number(params?.id) === chat.id;

  const otherMember = chat.members?.find((m) => m.userId !== me?.id)?.user;

  const displayTitle = chat?.title || otherMember?.name || "Чат";

  const displayAvatar = otherMember?.avatar?.url
    ? `http://localhost:3000${otherMember.avatar.url}`
    : undefined;

  return (
    <Link
      href={{
        pathname: "/chat/[id]",
        params: { id: chat.id.toString() },
      }}
      className={cn(
        "group relative flex items-center gap-3 p-3 mx-2 rounded-xl transition",
        "border border-transparent",
        "hover:bg-white/20 dark:hover:bg-white/5",
        active &&
          "bg-primary/10 border-primary/20 shadow-[0_0_12px_rgba(var(--primary),0.15)]",
      )}
    >
      <Avatar
        className={cn(
          "h-11 w-11 border transition",
          active
            ? "border-primary shadow-[0_0_12px_rgba(var(--primary),0.6)]"
            : "border-white/20",
        )}
      >
        <AvatarImage
          src={`http://localhost:3000${chat?.avatar?.url}` || displayAvatar}
        />
        <AvatarFallback>
          {displayTitle.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "text-sm font-medium truncate",
              active ? "text-primary" : "text-foreground",
            )}
          >
            {displayTitle}
          </span>

          {chat.lastMessage && (
            <span className="text-[10px] text-muted-foreground">
              {new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground truncate">
          {chat.lastMessage?.text || "Нет сообщений"}
        </p>
      </div>
    </Link>
  );
};
