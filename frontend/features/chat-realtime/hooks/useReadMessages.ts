"use client";

import { socket } from "@/shared/api/socket";
import { useEffect } from "react";

export const useReadMessages = (chatId: number, lastMessageId?: number) => {
  useEffect(() => {
    if (!lastMessageId) return;

    socket.emit("read", {
      chatId,
      messageId: lastMessageId,
    });
  }, [chatId, lastMessageId]);

  useEffect(() => {
    const handleRead = ({
      userId,
      messageId,
    }: {
      userId: number;
      messageId: number;
    }) => {
      console.log("read by", userId, messageId);
    };

    socket.on("messagesRead", handleRead);

    return () => {
      socket.off("messagesRead", handleRead);
    };
  }, []);
};
