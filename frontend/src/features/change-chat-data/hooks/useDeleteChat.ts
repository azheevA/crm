import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getChatControllerGetMyChatsQueryKey } from "@/src/shared/api/endpoints/chat/chat";
import { useRouter } from "next/navigation";
import { socket } from "@/src/shared/api/socket";

export const useChatSocketUpdates = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const handleChatDeleted = ({ chatId }: { chatId: number }) => {
      queryClient.invalidateQueries({
        queryKey: getChatControllerGetMyChatsQueryKey(),
      });
      const currentPath = window.location.pathname;
      if (currentPath.includes(`/chats/${chatId}`)) {
        router.push("/chats");
      }
    };

    socket.on("chatDeleted", handleChatDeleted);

    return () => {
      socket.off("chatDeleted", handleChatDeleted);
    };
  }, [queryClient, router]);
};
