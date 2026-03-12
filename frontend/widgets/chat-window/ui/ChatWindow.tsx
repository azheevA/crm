"use client";
import { MessageBubble } from "@/entities/messages/ui/MessageBubble";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { AddMembersModal } from "@/features/add-chat-member/ui/AddChatMember";
import { useChatSocketSync } from "@/features/chat-realtime/hooks/useChatSocketSync";
import { useReadMessages } from "@/features/chat-realtime/hooks/useReadMessages";
import { useTypingIndicator } from "@/features/chat-realtime/hooks/useTypingIndicator";
import { SendMessageForm } from "@/features/send-message/ui/SendMessageForm";
import {
  useChatControllerGetMessagesInfinite,
  useChatControllerGetChatDetails, // Предположим, Orval сгенерировал это
} from "@/shared/api/endpoints/chat/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { useMemo, useState } from "react";

interface Props {
  chatId: number;
}

export const ChatWindow = ({ chatId }: Props) => {
  const { user } = useCurrentUser();
  const { typingUsers, sendTyping } = useTypingIndicator(chatId);
  const [showAddMembers, setShowAddMembers] = useState(false);

  useChatSocketSync(chatId);

  const { data: chatDetails, isLoading: isChatLoading } =
    useChatControllerGetChatDetails(String(chatId));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMessagesLoading,
  } = useChatControllerGetMessagesInfinite(
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

  if (isMessagesLoading || isChatLoading) return <div>Загрузка чата...</div>;

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border rounded-xl shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
        <div className="flex flex-col">
          <h2 className="font-bold text-lg leading-none">
            {chatDetails?.title || "Чат"}
          </h2>
          <div className="flex items-center gap-1 mt-2">
            <div className="flex -space-x-2">
              {chatDetails?.members?.map((member) => (
                <Avatar
                  key={member.id}
                  className="w-6 h-6 border-2 border-white"
                >
                  <AvatarImage src={member.avatar?.url} />
                  <AvatarFallback className="text-[10px]">
                    {(member.name?.slice(0, 2) || "??").toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-2">
              {chatDetails?.members?.length ?? 0} участников
            </span>
          </div>
        </div>

        <button
          onClick={() => setShowAddMembers(true)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="16" y1="11" x2="22" y2="11" />
          </svg>
        </button>
      </div>

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
          <div className="text-sm text-gray-400 animate-pulse">
            кто-то печатает...
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-white">
        <SendMessageForm chatId={chatId} sendTyping={sendTyping} />
      </div>

      {showAddMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowAddMembers(false)}
              className="absolute top-2 right-2 p-2"
            >
              ✕
            </button>
            <AddMembersModal chatId={chatId} />
          </div>
        </div>
      )}
    </div>
  );
};
