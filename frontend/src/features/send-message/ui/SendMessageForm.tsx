"use client";

import { useState, KeyboardEvent } from "react";
import { socket } from "@/src/shared/api/socket";
import { SendHorizontalIcon } from "lucide-react";
import { Button } from "@/src/shared/ui/button";
import { Input } from "@/src/shared/ui/input";

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="flex items-center gap-2 p-2 rounded-2xl border border-white/10
    bg-white/50 dark:bg-zinc-950/40 backdrop-blur-xl shadow-2xl shadow-black 
    focus-within:ring-2 focus-within:ring-primary/40 transition"
    >
      <Input
        value={text}
        onKeyDown={handleKeyDown}
        onChange={(e) => {
          setText(e.target.value);
          sendTyping();
        }}
        placeholder="Напишите сообщение..."
        className="flex-1 bg-transparent px-3 py-2 text-sm outline-none
        placeholder:text-muted-foreground "
      />

      <Button
        size="icon"
        onClick={handleSend}
        disabled={!text.trim()}
        className="rounded-xl
       text-primary-foreground
        hover:shadow-[0_0_15px_rgba(var(--primary),0.7)]
        transition-all"
      >
        <SendHorizontalIcon className="w-4 h-4" />
      </Button>
    </div>
  );
};
