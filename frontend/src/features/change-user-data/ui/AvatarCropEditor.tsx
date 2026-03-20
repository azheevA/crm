"use client";

import Cropper from "react-easy-crop";
import { useState } from "react";
import { Button } from "@/src/shared/ui/button";
import { getCroppedImg } from "../utils/crop-image";
import { optimizeImage } from "../utils/optimized-image";
import type { Area } from "react-easy-crop";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";

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
    <Dialog open={true} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Обрезать аватар</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-64 rounded-xl overflow-hidden bg-black">
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

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onCancel}>
            Отмена
          </Button>

          <Button onClick={handleSave}>Сохранить</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
