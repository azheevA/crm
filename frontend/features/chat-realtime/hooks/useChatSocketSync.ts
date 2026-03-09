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
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Сокет не запущен: Токен не найден в localStorage");
      return;
    }
    socket.auth = { token };
    socket.connect();
    socket.on("connect", () => console.log("Сокет успешно подключен"));
    socket.on("connect_error", (err) =>
      console.error("Ошибка подключения:", err.message),
    );

    const handleNewMessage = (
      newMessage: ChatControllerGetMessagesInfiniteQueryResult["data"][number],
    ) => {
      const queryKey = getChatControllerGetMessagesInfiniteQueryKey({
        limit: 20,
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
      socket.off("connect");
      socket.off("connect_error");
      socket.off("recMessage", handleNewMessage);
      socket.disconnect();
    };
  }, [queryClient]);
};
