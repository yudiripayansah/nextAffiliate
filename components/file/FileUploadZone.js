"use client";

import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/utils";

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/files", { method: "POST", body: formData });
  return response.json();
}

export default function FileUploadZone({ onUploaded }) {
  const inputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState("");

  async function handleUpload(fileList) {
    const files = Array.from(fileList ?? []).filter((file) => file.type.startsWith("image/"));
    if (!files.length) return;

    setError("");
    setProgress({ done: 0, total: files.length });

    const failed = [];
    for (let index = 0; index < files.length; index++) {
      const result = await uploadFile(files[index]);
      if (result.success) {
        onUploaded(result.data);
      } else {
        failed.push(`${files[index].name}: ${result.message}`);
      }
      setProgress({ done: index + 1, total: files.length });
    }

    if (failed.length) {
      setError(failed.join(" · "));
    }
    setProgress(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-8 text-center transition-colors",
        isDragOver
          ? "border-primary bg-primary/5"
          : "border-input bg-background hover:border-primary/60 hover:bg-muted/40"
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragOver(false);
        if (!progress) handleUpload(event.dataTransfer.files);
      }}
    >
      {progress ? (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm font-medium text-primary">
            Mengupload {progress.done}/{progress.total} file...
          </p>
          <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(progress.done / progress.total) * 100}%` }}
            />
          </div>
        </div>
      ) : (
        <label className="block cursor-pointer">
          <span className="flex flex-col items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
              <CloudUpload className="size-6 text-primary" aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium">
                Drop file di sini atau <span className="text-primary">klik untuk upload</span>
              </span>
              <span className="text-xs text-muted-foreground">
                JPG, PNG, WEBP — maksimal 5MB, bisa pilih banyak sekaligus
              </span>
            </span>
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            onChange={(event) => handleUpload(event.target.files)}
          />
        </label>
      )}

      {error ? <p className="mt-3 text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
