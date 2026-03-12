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
    if (!socket.connected) {
      socket.connect();
    }

    const join = () => {
      console.log("Emit joinChat for:", chatId);
      socket.emit("joinChat", { chatId });
    };

    const handleConnect = () => {
      console.log("Socket connected, joining room...");
      join();
    };

    const handleNewMessage = (
      newMessage: ChatControllerGetMessagesInfiniteQueryResult["data"][number],
    ) => {
      console.log("New message received via socket:", newMessage);
      const queryKey = getChatControllerGetMessagesInfiniteQueryKey({
        chatId,
        limit: 20,
      });

      queryClient.setQueryData<
        InfiniteData<ChatControllerGetMessagesInfiniteQueryResult>
      >(queryKey, (oldData) => {
        if (!oldData) {
          queryClient.invalidateQueries({ queryKey });
          return oldData;
        }

        const lastPage = oldData.pages[0];

        return {
          ...oldData,
          pages: [
            {
              ...lastPage,
              data: [newMessage, ...lastPage.data],
            },
            ...oldData.pages.slice(1),
          ],
        };
      });
    };
    if (socket.connected) {
      join();
    }

    socket.on("connect", handleConnect);
    socket.on("recMessage", handleNewMessage);

    return () => {
      console.log("Leaving chat:", chatId);
      socket.emit("leaveChat", { chatId });
      socket.off("connect", handleConnect);
      socket.off("recMessage", handleNewMessage);
    };
  }, [chatId, queryClient]);
};
