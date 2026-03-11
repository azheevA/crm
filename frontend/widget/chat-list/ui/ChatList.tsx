"use client";

import { useChatListSocket } from "@/features/chat-realtime/hooks/userChatListSocket";
import { useChatControllerGetMyChats } from "@/shared/api/endpoints/chat/chat";
import { ChatItem } from "./ChatItem";

export const ChatList = () => {
  useChatListSocket();

  const { data, isLoading } = useChatControllerGetMyChats();

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col border-r w-80">
      {data?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
