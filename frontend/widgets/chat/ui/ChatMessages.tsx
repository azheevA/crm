"use client";

import { useChatControllerGetMessages } from "@/shared/api/endpoints/chat/chat";
import { MessageItem } from "./MessageItem";

interface Props {
  chatId: number;
}

export const ChatMessages = ({ chatId }: Props) => {
  const { data, isLoading, isError } = useChatControllerGetMessages({
    chatId,
    limit: 20,
  });

  if (isLoading) return <div>Загрузка сообщений...</div>;

  if (isError) return <div>Ошибка загрузки сообщений</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {data?.data?.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
