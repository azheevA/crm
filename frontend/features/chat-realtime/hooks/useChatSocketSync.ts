"use client";
import {
  ChatControllerGetMessagesInfiniteQueryResult,
  getChatControllerGetMessagesInfiniteQueryKey,
} from "@/shared/api/endpoints/chat/chat";
import { socket } from "@/shared/api/socket";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useChatSocketSync = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.connect();

    const handleNewMessage = (
      newMessage: ChatControllerGetMessagesInfiniteQueryResult["data"][number],
    ) => {
      const queryKey = getChatControllerGetMessagesInfiniteQueryKey({
        limit: 20,
        skip: 0,
      });

      queryClient.setQueryData<
        InfiniteData<ChatControllerGetMessagesInfiniteQueryResult>
      >(queryKey, (oldData) => {
        if (!oldData) return oldData;

        const newPages = [...oldData.pages];

        newPages[0] = {
          ...newPages[0],
          data: [newMessage, ...newPages[0].data],
        };

        return {
          ...oldData,
          pages: newPages,
        };
      });
    };

    socket.on("recMessage", handleNewMessage);

    return () => {
      socket.off("recMessage", handleNewMessage);
    };
  }, [queryClient]);
};
