"use client";

import { useChatControllerGetMyChats } from "@/shared/api/endpoints/chat/chat";
import { ChatItem } from "./ChatItem";
import { useChatListSocket } from "@/features/chat-realtime/hooks/userChatListSocket";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { Skeleton } from "@/shared/ui/skeleton";

export const ChatList = () => {
  const { data: chats, isLoading } = useChatControllerGetMyChats();

  useChatListSocket();

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/5" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {chats?.length ? (
            chats.map((item) => <ChatItem key={item.id} chat={item} />)
          ) : (
            <div className="p-8 text-center text-zinc-500 text-sm">
              Чатов пока нет
            </div>
          )}
        </div>
      </ScrollArea>
      {chats && chats.length > 0 && (
        <div className="p-3 border-t bg-zinc-50/50 dark:bg-zinc-900/50">
          <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest font-medium">
            Активных диалогов: {chats.length}
          </p>
        </div>
      )}
    </div>
  );
};
