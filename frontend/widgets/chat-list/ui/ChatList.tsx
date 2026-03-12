"use client";

import { useChatControllerGetMyChats } from "@/shared/api/endpoints/chat/chat";
import { ChatItem } from "./ChatItem";
import { useChatListSocket } from "@/features/chat-realtime/hooks/userChatListSocket";

export const ChatList = () => {
  const { data, isLoading } = useChatControllerGetMyChats();

  useChatListSocket();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data?.map((item) => (
        <ChatItem key={item.id} chat={item} />
      ))}
    </div>
  );
};
