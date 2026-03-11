import { socket } from "@/shared/api/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useChatListSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleChatUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ["chatControllerGetMyChats"],
      });
    };

    socket.on("chatUpdated", handleChatUpdate);

    return () => {
      socket.off("chatUpdated", handleChatUpdate);
    };
  }, []);
};
