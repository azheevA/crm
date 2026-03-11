"use client";

import { useState } from "react";
import { useChatControllerGetMyChats } from "@/shared/api/endpoints/chat/chat";
import { ChatItem } from "./ChatItem";
import { CreateChatModal } from "@/features/create-chat/ui/CreateChatModal";
import { useChatListSocket } from "@/features/chat-realtime/hooks/userChatListSocket";

export const ChatList = () => {
  useChatListSocket();

  const { data, isLoading } = useChatControllerGetMyChats();
  const [showModal, setShowModal] = useState(false);

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="flex flex-col border-r w-80">
      <button
        onClick={() => setShowModal(true)}
        className="p-3 bg-blue-500 text-white"
      >
        + Новый чат
      </button>

      {showModal && <CreateChatModal />}

      {data?.map((chat) => (
        <ChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
};
