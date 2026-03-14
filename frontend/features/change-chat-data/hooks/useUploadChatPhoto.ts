import { useChatControllerUploadAvatar } from "@/shared/api/endpoints/chat/chat";
import { useQueryClient } from "@tanstack/react-query";
import {
  getChatControllerGetChatQueryKey,
  getChatControllerGetMyChatsQueryKey,
} from "@/shared/api/endpoints/chat/chat";

export const useChatAvatarUploader = (chatId: number) => {
  const queryClient = useQueryClient();
  const mutation = useChatControllerUploadAvatar();

  const upload = async (file: File) => {
    try {
      await mutation.mutateAsync({
        chatId: String(chatId),
        data: {
          file: file,
        },
      });

      queryClient.invalidateQueries({
        queryKey: getChatControllerGetChatQueryKey(String(chatId)),
      });
      queryClient.invalidateQueries({
        queryKey: getChatControllerGetMyChatsQueryKey(),
      });
    } catch (error) {
      console.error(error);
    }
  };

  return { mutation, upload };
};
