import {
  getChatControllerGetMyChatsQueryKey,
  useChatControllerDeleteChat,
} from "@/src/shared/api/endpoints/chat/chat";
import { Button } from "@/src/shared/ui/button";
import { useQueryClient } from "@tanstack/react-query";

export const DeleteChatButton = ({ chatId }: { chatId: number }) => {
  const queryClient = useQueryClient();
  const { mutate: deleteChat } = useChatControllerDeleteChat();

  const handleDelete = () => {
    if (
      confirm("Вы уверены, что хотите удалить чат? Это действие необратимо.")
    ) {
      deleteChat(
        { chatId: String(chatId) },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: getChatControllerGetMyChatsQueryKey(),
            });
          },
        },
      );
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
    >
      Удалить чат
    </Button>
  );
};
