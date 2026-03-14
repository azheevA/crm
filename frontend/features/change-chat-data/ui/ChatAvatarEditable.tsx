"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { ImagePlus } from "lucide-react";
import { useChatAvatarUploader } from "../hooks/useUploadChatPhoto";
import { AvatarCropEditor } from "@/features/change-user-data/ui/AvatarCropEditor";
import { getFullImageUrl } from "@/features/change-user-data/utils/get-url-image";

interface Props {
  chat: {
    id: number;
    title?: string | null;
    avatar?: { url?: string | null } | null;
  };
  canEdit: boolean;
}

export function ChatAvatarEditable({ chat, canEdit }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const { mutation, upload } = useChatAvatarUploader(chat.id);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };
  const avatartUrl = `http:localhost:5000${chat.avatar?.url}`;

  return (
    <div className="relative w-12 h-12 shrink-0">
      <Avatar className="w-12 h-12 border shadow-sm">
        <AvatarImage src={getFullImageUrl(chat.avatar?.url)} />
        <AvatarFallback className="bg-zinc-100 text-zinc-500 text-xs">
          {chat?.title?.slice(0, 2).toUpperCase() ?? "??"}
        </AvatarFallback>
      </Avatar>
      {canEdit && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center 
            rounded-full bg-black/40 opacity-0 hover:opacity-100 transition cursor-pointer"
        >
          <ImagePlus size={18} className="text-white" />
        </div>
      )}
      <p>{avatartUrl}</p>
      <input
        hidden
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {image && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-zinc-950 p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <AvatarCropEditor
              image={image}
              onSave={(file) => {
                upload(file);
                setImage(null);
              }}
              onCancel={() => setImage(null)}
            />
          </div>
        </div>
      )}

      {mutation.status === "pending" && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow">
          <div className="w-2 h-2 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
