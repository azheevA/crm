import { ChatWindow } from "@/widget/chat-window/ui/ChatWindow";

function page() {
  return (
    <div className="container mx-auto py-8 text-black">
      <h1 className="text-2xl font-bold mb-6">Сообщения</h1>
      <ChatWindow />
    </div>
  );
}
export default page;
