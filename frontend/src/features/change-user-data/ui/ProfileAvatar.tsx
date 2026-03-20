"use client";

import { useRef, useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/src/shared/ui/avatar";
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

    const url = URL.createObjectURL(file);
    setImage(url);
  };

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
    };
  }, [image]);

  const avatarUrl = user?.avatar?.url
    ? `http://localhost:3000${user.avatar.url}`
    : "/not-avatar.jpg";

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 group">
        <Avatar
          className="
          w-32 h-32
          border border-white/20
          shadow-xl
          transition
          group-hover:scale-[1.03]
          "
        >
          <AvatarImage src={avatarUrl} />

          <AvatarFallback>
            {user?.name?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="
          absolute inset-0
          flex items-center justify-center
          rounded-full
          bg-black/60
          opacity-0
          group-hover:opacity-100
          transition
          cursor-pointer
          backdrop-blur-sm
          "
        >
          <ImagePlus size={28} className="text-white" />
        </div>
        {mutation.status === "pending" && (
          <div
            className="
            absolute inset-0
            rounded-full
            bg-black/70
            flex items-center justify-center
            "
          >
            <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          </div>
        )}
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

      {mutation.status === "error" && (
        <p className="text-sm text-red-500">Ошибка загрузки</p>
      )}

      {mutation.status === "success" && (
        <p className="text-sm text-green-500">Аватар обновлён</p>
      )}
    </div>
  );
}
