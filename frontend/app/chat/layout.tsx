import { ChatList } from "@/widgets/chat-list/ui/ChatList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-3xl p-5">Сообщения</h1>
      <div className="w-full border-r overflow-y-auto flex flex-row">
        <ChatList />
        <div className="flex-2">{children}</div>
      </div>
    </div>
  );
}
