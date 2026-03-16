import { CreateChatModal } from "@/features/create-chat/ui/CreateChatModal";
import { ChatList } from "@/widgets/chat-list/ui/ChatList";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
      flex h-screen
      bg-linear-to-b
      from-white
      to-zinc-100
      dark:from-zinc-950
      dark:to-black
    "
    >
      <aside
        className="
        w-[320px]
        flex flex-col
        border-r border-white/10
        bg-white/40 dark:bg-zinc-950/40
        backdrop-blur-xl
      "
      >
        <div className="p-5 border-b border-white/10">
          <h1 className="text-xl font-semibold">Чаты</h1>
        </div>

        <div className="p-4">
          <CreateChatModal />
        </div>

        <div className="flex-1 overflow-y-auto">
          <ChatList />
        </div>
      </aside>

      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
