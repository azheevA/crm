"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui/avatar";
import { ImagePlus } from "lucide-react";
import { AvatarCropEditor } from "./AvatarCropEditor";
import { useAvatarUploader } from "../hooks/UseUploadAvatar";

interface ProfileAvatarProps {
  user: {
    name?: string | null;
    avatar?: {
      url?: string | null;
    } | null;
  };
}

export function ProfileAvatar({ user }: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const { mutation, upload } = useAvatarUploader();

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };
  const avatarUrl = user?.avatar?.url
    ? `http://localhost:3000${user.avatar.url}`
    : "/not-avatar.jpg";
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <Avatar className="w-32 h-32 cursor-pointer">
          <AvatarImage
            src={
              user?.avatar?.url
                ? `http://localhost:3000${user.avatar.url}`
                : "/not-avatar.jpg"
            }
          />

          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>

        <div
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center 
            rounded-full bg-black/40 opacity-0 hover:opacity-100 transition cursor-pointer"
        >
          <ImagePlus size={26} className="text-white" />
        </div>
      </div>

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
        <AvatarCropEditor
          image={image}
          onSave={(file) => {
            upload(file);
            setImage(null);
          }}
          onCancel={() => setImage(null)}
        />
      )}
      {mutation.status === "pending" && <p>Загрузка...</p>}
      {mutation.status === "error" && (
        <p className="text-red-500">Ошибка загрузки!</p>
      )}
      {mutation.status === "success" && (
        <p className="text-green-500">Аватар успешно загружен!</p>
      )}
      <p className="text-xs break-all p-20">{avatarUrl}</p>
    </div>
  );
}
