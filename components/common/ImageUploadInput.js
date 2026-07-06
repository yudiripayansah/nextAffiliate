"use client";

import { useState } from "react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ImageUploadInput({ id, label, value, onChange, folder }) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", { method: "POST", body: formData });
    const result = await response.json();

    if (!result.success) {
      setError(result.message);
    } else {
      onChange(result.data.url);
    }

    setIsUploading(false);
    event.target.value = "";
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {value ? (
        <Image
          src={value}
          alt={label}
          width={96}
          height={96}
          className="rounded-md border object-cover"
        />
      ) : null}
      <Input id={id} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} disabled={isUploading} />
      {isUploading ? <p className="text-sm text-muted-foreground">Mengunggah...</p> : null}
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
