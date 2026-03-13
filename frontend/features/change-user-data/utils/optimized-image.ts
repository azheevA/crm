export async function optimizeImage(blob: Blob) {
  const image = new Image();
  image.src = URL.createObjectURL(blob);

  await new Promise((resolve) => {
    image.onload = resolve;
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const size = 512;

  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(image, 0, 0, size, size);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), "image/jpeg", 0.8);
  });
}
