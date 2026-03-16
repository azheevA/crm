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
      <div className="space-y-4 p-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full opacity-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="
      flex flex-col h-full
      bg-white/40 dark:bg-zinc-950/40
      backdrop-blur-xl
      border-r border-white/10
    "
    >
      <div className="px-6 pt-6 pb-2">
        <h3 className="text-xs font-semibold tracking-widest text-muted-foreground">
          Чаты
        </h3>
      </div>

      <ScrollArea className="flex-1 px-2">
        <div className="flex flex-col gap-1 pb-4">
          {chats?.length ? (
            chats.map((chatItem) => (
              <ChatItem key={chatItem.id} chat={chatItem} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <div className="w-12 h-12 rounded-full border border-dashed flex items-center justify-center mb-4">
                +
              </div>
              <p className="text-sm">Нет активных чатов</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {chats && chats.length > 0 && (
        <div
          className="
          p-4 border-t border-white/10
          bg-white/30 dark:bg-black/20
          backdrop-blur
        "
        >
          <div className="flex items-center justify-center gap-2 text-xs text-primary">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            {chats.length} активных чатов
          </div>
        </div>
      )}
    </div>
  );
};
