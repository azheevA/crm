import {
  ChatControllerGetMessagesInfiniteQueryResult,
  getChatControllerGetMessagesInfiniteQueryKey,
} from "@/shared/api/endpoints/chat/chat";
import { socket } from "@/shared/api/socket";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useChatSocketSync = (chatId: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const handleConnect = () => {
      console.log("SOCKET CONNECTED", socket.id);
      socket.emit("joinChat", { chatId });
    };

    const handleDisconnect = () => {
      console.log("SOCKET DISCONNECTED");
    };

    const handleNewMessage = (
      newMessage: ChatControllerGetMessagesInfiniteQueryResult["data"][number],
    ) => {
      console.log("NEW MESSAGE", newMessage);

      const queryKey = getChatControllerGetMessagesInfiniteQueryKey({
        chatId,
        limit: 20,
      });

      queryClient.setQueryData<
        InfiniteData<ChatControllerGetMessagesInfiniteQueryResult>
      >(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const firstPage = oldData.pages[0];

        return {
          ...oldData,
          pages: [
            {
              ...firstPage,
              data: [newMessage, ...firstPage.data],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    };

    socket.on("connect", handleConnect);
    socket.on("recMessage", handleNewMessage);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.emit("leaveChat", { chatId });

      socket.off("connect", handleConnect);
      socket.off("recMessage", handleNewMessage);
      socket.off("disconnect", handleDisconnect);
    };
  }, [chatId, queryClient]);
};
