"use client";
import { MessageBubble } from "@/entities/messages/ui/MessageBubble";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { AddMembersModal } from "@/features/add-chat-member/ui/AddChatMember";
import { useChatSocketSync } from "@/features/chat-realtime/hooks/useChatSocketSync";
import { useReadMessages } from "@/features/chat-realtime/hooks/useReadMessages";
import { useTypingIndicator } from "@/features/chat-realtime/hooks/useTypingIndicator";
import { SendMessageForm } from "@/features/send-message/ui/SendMessageForm";
import { useChatControllerGetMessagesInfinite } from "@/shared/api/endpoints/chat/chat";
import { useMemo, useState } from "react";

interface Props {
  chatId: number;
}
export const ChatWindow = ({ chatId }: Props) => {
  const { user } = useCurrentUser();
  const { typingUsers, sendTyping } = useTypingIndicator(chatId);
  const [showAddMembers, setShowAddMembers] = useState(false);

  useChatSocketSync(chatId);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useChatControllerGetMessagesInfinite(
      {
        chatId,
        limit: 20,
      },
      {
        query: {
          getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
        },
      },
    );

  const messages = useMemo(() => {
    return data?.pages.flatMap((page) => page.data).reverse() ?? [];
  }, [data]);

  const lastMessageId = messages[messages.length - 1]?.id;
  useReadMessages(chatId, lastMessageId);

  if (isLoading) return <div>Загрузка чата...</div>;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border rounded-xl shadow-sm bg-white">
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-sm text-blue-500 py-2"
          >
            {isFetchingNextPage ? "Загрузка..." : "Загрузить предыдущие"}
          </button>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.author.id === user?.id}
          />
        ))}

        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400">кто-то печатает...</div>
        )}
      </div>

      <SendMessageForm chatId={chatId} sendTyping={sendTyping} />

      <button
        onClick={() => setShowAddMembers(true)}
        className="text-sm text-blue-500"
      >
        Добавить участников
      </button>

      {showAddMembers && <AddMembersModal chatId={chatId} />}
    </div>
  );
};
