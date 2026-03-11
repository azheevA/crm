import { memo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { ChatControllerGetMessagesInfiniteQueryResult } from "@/shared/api/endpoints/chat/chat";

type SingleMessage =
  ChatControllerGetMessagesInfiniteQueryResult["data"][number];

interface MessageBubbleProps {
  message: SingleMessage;
  isMe: boolean;
}

const MessageBubbleMemo = ({ message, isMe }: MessageBubbleProps) => {
  return (
    <div className={`flex gap-3 ${isMe ? "flex-row-reverse" : ""}`}>
      <Avatar>
        <AvatarImage src={message.author.avatar?.url} />
        <AvatarFallback>{message.author.name.slice(0, 2)}</AvatarFallback>
      </Avatar>

      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <p>{message.text ?? "Сообщение удалено"}</p>

        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.createdAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

export const MessageBubble = memo(MessageBubbleMemo);
