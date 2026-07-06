"use client";

import { useState } from "react";
import Image from "next/image";
import { X, GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", "products");

  const response = await fetch("/api/upload", { method: "POST", body: formData });
  return response.json();
}

function reorder(images, fromIndex, toIndex) {
  const next = [...images];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export default function ProductImagesField({ images, onChange }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  async function handleFilesChange(event) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setError("");
    setIsUploading(true);

    const results = await Promise.all(files.map(uploadImage));
    const failed = results.find((result) => !result.success);

    if (failed) {
      setError(failed.message);
    }

    const uploadedUrls = results.filter((result) => result.success).map((result) => result.data.url);
    onChange([...images, ...uploadedUrls]);

    setIsUploading(false);
    event.target.value = "";
  }

  function handleRemove(index) {
    onChange(images.filter((_, imageIndex) => imageIndex !== index));
  }

  function handleDrop(index) {
    if (draggedIndex === null || draggedIndex === index) return;
    onChange(reorder(images, draggedIndex, index));
    setDraggedIndex(null);
  }

  return (
    <div className="flex flex-col gap-2 sm:col-span-2">
      <Label htmlFor="images">Images</Label>

      {images.length ? (
        <div className="flex flex-wrap gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => setDraggedIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(index)}
              className="relative cursor-grab active:cursor-grabbing"
            >
              <Image
                src={url}
                alt={`Product image ${index + 1}`}
                width={80}
                height={80}
                className="rounded-md border object-cover"
              />
              <GripVertical className="absolute bottom-0.5 left-0.5 size-4 rounded bg-background/80 text-muted-foreground" />
              {index === 0 ? (
                <span className="absolute -top-2 left-0 rounded bg-primary px-1 text-[10px] text-primary-foreground">
                  Thumbnail
                </span>
              ) : null}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                aria-label={`Hapus gambar ${index + 1}`}
                className="absolute -right-2 -top-2 rounded-full bg-destructive p-0.5 text-destructive-foreground"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <Input
        id="images"
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFilesChange}
        disabled={isUploading}
      />
      <p className="text-xs text-muted-foreground">Seret gambar untuk mengubah urutan. Gambar pertama menjadi thumbnail.</p>
      {isUploading ? <p className="text-sm text-muted-foreground">Mengunggah...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
