import { socket } from "@/shared/api/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useChatListSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleUpdate = () => {
      queryClient.invalidateQueries({
        queryKey: ["chatControllerGetMyChats"],
      });
    };

    socket.on("chatUpdated", handleUpdate);
    socket.on("chatAdded", handleUpdate);

    return () => {
      socket.off("chatUpdated", handleUpdate);
      socket.off("chatAdded", handleUpdate);
    };
  }, [queryClient]);
};
