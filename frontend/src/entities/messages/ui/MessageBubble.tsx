import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/shared/ui/avatar";
import { ChatControllerGetMessagesInfiniteQueryResult } from "@/src/shared/api/endpoints/chat/chat";

type SingleMessage =
  ChatControllerGetMessagesInfiniteQueryResult["data"][number];

interface MessageBubbleProps {
  title: string;
  message: SingleMessage;
  isMe: boolean;
}

const MessageBubbleMemo = ({ title, message, isMe }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
      <Avatar>
        <AvatarImage
          src={`http://localhost:3000${message.author.avatar?.url}`}
        />
        <AvatarFallback>{message.author.name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
        <div className="text-xs text-muted-foreground mb-1 ml-1 mr-1">
          {title}
        </div>

        <div
          className={`max-w-full rounded-lg p-3 ${
            isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }`}
        >
          <p>{message.text ?? "Сообщение удалено"}</p>

          <span className="text-xs opacity-70 mt-1 block">
            {new Date(message.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export const MessageBubble = memo(MessageBubbleMemo);
