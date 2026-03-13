"use client";
import Cropper from "react-easy-crop";
import { useState } from "react";
import { Button } from "@/shared/ui/button";
import { getCroppedImg } from "../utils/crop-image";
import type { Area } from "react-easy-crop";
import { optimizeImage } from "../utils/optimized-image";
type Props = {
  image: string;
  onCancel: () => void;
  onSave: (file: File) => void;
};

export function AvatarCropEditor({ image, onCancel, onSave }: Props) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pixels, setPixels] = useState<Area | null>(null);

  const handleSave = async () => {
    if (!pixels) return;
    const blob = await getCroppedImg(image, pixels);
    const optimized = await optimizeImage(blob);

    const file = new File([optimized], "avatar.jpg", {
      type: "image/jpeg",
    });

    onSave(file);
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-4">
      <div className="relative w-full h-64 rounded-xl overflow-hidden">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          cropShape="round"
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setPixels(pixels)}
        />
      </div>

      <input
        type="range"
        min={1}
        max={3}
        step={0.01}
        value={zoom}
        onChange={(e) => setZoom(Number(e.target.value))}
        className="w-full"
      />

      <div className="flex gap-3 justify-end">
        <Button variant="ghost" onClick={onCancel}>
          Отмена
        </Button>

        <Button onClick={handleSave}>Сохранить</Button>
      </div>
    </div>
  );
}
