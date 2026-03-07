"use client";
import { useMemo } from "react";
import { SendMessageForm } from "@/features/send-message/ui/SendMessageForm";
import { useChatSocketSync } from "@/features/chat-realtime/hooks/useChatSocketSync";
import { useChatControllerGetMessagesInfinite } from "@/shared/api/endpoints/chat/chat";
import { MessageBubble } from "@/entities/messages/ui/MessageBubble";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";

export const ChatWindow = () => {
  const { user } = useCurrentUser();
  useChatSocketSync();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatControllerGetMessagesInfinite(
      { limit: 20 },
      {
        query: {
          getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
        },
      },
    );
  const messages = useMemo(() => {
    return data?.pages.flatMap((page) => page.data) ?? [];
  }, [data]);

  if (isLoading) return <div>Загрузка чата...</div>;

  return (
    <div className="flex flex-col h-150 max-w-2xl mx-auto border rounded-xl shadow-sm bg-white">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.author.id === user?.id}
          />
        ))}
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-sm text-blue-500 py-2"
          >
            {isFetchingNextPage ? "Загрузка..." : "Загрузить предыдущие"}
          </button>
        )}
      </div>
      <SendMessageForm />
    </div>
  );
};
