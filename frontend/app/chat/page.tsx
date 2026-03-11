import { ChatList } from "@/widget/chat-list/ui/ChatList";
import { ChatWindow } from "@/widget/chat-window/ui/ChatWindow";

export default function Page() {
  const chatId = 1;

  return (
    <div className="container mx-auto py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Сообщения</h1>
      <ChatList />
      <div className="flex-1">
        <ChatWindow chatId={chatId} />
      </div>
    </div>
  );
}
