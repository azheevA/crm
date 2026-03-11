"use client";

import { socket } from "@/shared/api/socket";
import { useEffect, useState } from "react";

export const useTypingIndicator = (chatId: number) => {
  const [typingUsers, setTypingUsers] = useState<number[]>([]);

  useEffect(() => {
    const handleTyping = ({ userId }: { userId: number }) => {
      setTypingUsers((prev) => {
        if (prev.includes(userId)) return prev;
        return [...prev, userId];
      });

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }, 2000);
    };

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
    };
  }, [chatId]);

  const sendTyping = () => {
    socket.emit("typing", { chatId });
  };

  return {
    typingUsers,
    sendTyping,
  };
};
