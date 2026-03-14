"use client";

import { MessageBubble } from "@/entities/messages/ui/MessageBubble";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { AddMembersModal } from "@/features/add-chat-member/ui/AddChatMember";
import { ChatAvatarEditable } from "@/features/change-chat-data/ui/ChatAvatarEditable";
import { getFullImageUrl } from "@/features/change-user-data/utils/get-url-image";
import { useChatSocketSync } from "@/features/chat-realtime/hooks/useChatSocketSync";
import { useReadMessages } from "@/features/chat-realtime/hooks/useReadMessages";
import { useTypingIndicator } from "@/features/chat-realtime/hooks/useTypingIndicator";
import { SendMessageForm } from "@/features/send-message/ui/SendMessageForm";
import {
  useChatControllerGetMessagesInfinite,
  useChatControllerGetChat,
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
    useChatControllerGetChat(String(chatId));

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isMessagesLoading,
  } = useChatControllerGetMessagesInfinite(
    { chatId, limit: 20 },
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

  const canEdit = useMemo(() => {
    return true;
  }, []);

  if (isMessagesLoading || isChatLoading) {
    return <div className="p-8 text-center">Загрузка...</div>;
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto border rounded-xl shadow-sm bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50/50">
        <div className="flex items-center gap-4">
          <ChatAvatarEditable
            chat={{
              id: chatId,
              title: chatDetails?.title,
              avatar: chatDetails?.avatar,
            }}
            canEdit={canEdit}
          />

          <div className="flex flex-col">
            <h2 className="font-bold text-lg leading-tight">
              {chatDetails?.title || "Чат"}
            </h2>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-1.5">
                {chatDetails?.members?.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    className="w-5 h-5 border border-white"
                  >
                    <AvatarImage src={getFullImageUrl(member.avatar?.url)} />
                    <AvatarFallback className="text-[7px]">
                      {member.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <span className="text-[11px] text-gray-500">
                {chatDetails?.members?.length ?? 0} участников
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowAddMembers(true)}
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          +
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-zinc-50/30">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-xs text-blue-500 font-medium self-center py-2"
          >
            {isFetchingNextPage ? "Загрузка..." : "Показать еще"}
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
          <div className="text-[11px] text-gray-400 italic animate-pulse">
            печатает...
          </div>
        )}
      </div>

      <div className="border-t p-4 bg-white">
        <SendMessageForm chatId={chatId} sendTyping={sendTyping} />
      </div>

      {showAddMembers && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            <button
              onClick={() => setShowAddMembers(false)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full z-10"
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
