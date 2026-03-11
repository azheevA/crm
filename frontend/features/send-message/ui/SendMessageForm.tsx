"use client";

import { useState } from "react";
import { socket } from "@/shared/api/socket";
interface Props {
  chatId: number;
  sendTyping: () => void;
}

export const SendMessageForm = ({ chatId, sendTyping }: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;

    socket.emit("sendMessage", {
      text,
      chatId,
    });

    setText("");
  };

  return (
    <div className="border-t p-3 flex gap-2">
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          sendTyping();
        }}
        placeholder="Введите сообщение..."
        className="flex-1 border rounded-lg px-3 py-2"
      />

      <button
        onClick={handleSend}
        className="bg-blue-500 text-white px-4 rounded-lg"
      >
        Отправить
      </button>
    </div>
  );
};
