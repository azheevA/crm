"use client";
import { MessageBubble } from "@/entities/messages/ui/MessageBubble";
import { useCurrentUser } from "@/entities/user/hooks/useCurrentUser";
import { AddMembersModal } from "@/features/add-chat-member/ui/AddChatMember";
import { ChatAvatarEditable } from "@/features/change-chat-data/ui/ChatAvatarEditable";
import { DeleteChatButton } from "@/features/change-chat-data/ui/ChatDeleteButton";
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
import { Button } from "@/shared/ui/button";
import { PlusIcon } from "lucide-react";
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

  if (isMessagesLoading || isChatLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-muted-foreground animate-pulse">
          Загрузка чата...
        </span>
      </div>
    );
  }

  return (
    <div
      className="
      flex flex-col h-full
      bg-white/40 dark:bg-zinc-950/40
      backdrop-blur-xl
      border border-white/10
      rounded-2xl
      overflow-hidden
    "
    >
      <div
        className="
        flex items-center justify-between
        px-6 py-4
        border-b border-white/10
        bg-white/40 dark:bg-black/20
        backdrop-blur
      "
      >
        <div className="flex items-center gap-4">
          <ChatAvatarEditable
            chat={{
              id: chatId,
              title: chatDetails?.title,
              avatar: chatDetails?.avatar,
            }}
            canEdit
          />

          <div className="flex flex-col">
            <span className="font-semibold">
              {chatDetails?.title || "Chat"}
            </span>

            <div className="flex items-center gap-2 mt-1">
              <div className="flex -space-x-2">
                {chatDetails?.members?.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.userId}
                    className="w-6 h-6 border border-background"
                  >
                    <AvatarImage
                      src={getFullImageUrl(member.user.avatar?.url)}
                    />
                    <AvatarFallback className="text-[9px]">
                      {member.user.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>

              <span className="text-xs text-muted-foreground">
                {chatDetails?.members?.length ?? 0} участников
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DeleteChatButton chatId={chatId} />

          <Button
            variant="secondary"
            size="icon"
            onClick={() => setShowAddMembers(true)}
          >
            <PlusIcon size={16} />
          </Button>
        </div>
      </div>

      <div
        className="
        flex-1 overflow-y-auto
        px-6 py-6
        space-y-6
      "
      >
        {hasNextPage && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? "Загрузка..." : "Показать старые"}
            </Button>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isMe={msg.author.id === user?.id}
          />
        ))}

        {typingUsers.length > 0 && (
          <div className="text-xs text-primary animate-pulse">печатает...</div>
        )}
      </div>

      <div
        className="
        p-4 mx-2
        border-t border-white/20
        bg-white/40 dark:bg-black/20
        backdrop-blur shadow-2xl shadow-black rounded-2xl
      "
      >
        <SendMessageForm chatId={chatId} sendTyping={sendTyping} />
      </div>

      {showAddMembers && (
        <div
          className="
                      fixed inset-0 z-50
                      flex items-center justify-center
                    bg-black/60 backdrop-blur-md
                      p-4
                    "
          onClick={() => setShowAddMembers(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md">
            <AddMembersModal
              chatId={chatId}
              onClose={() => setShowAddMembers(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
