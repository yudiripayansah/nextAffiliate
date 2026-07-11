"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/date";
import { formatFileSize } from "@/utils/formatFileSize";

export default function FileDetailPanel({ file, onDelete }) {
  const [isCopied, setIsCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(file.url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <aside className="w-64 shrink-0 overflow-hidden rounded-xl border bg-background">
      <div className="relative aspect-square bg-muted/40">
        <Image
          src={file.url}
          alt={file.name || "File"}
          fill
          sizes="16rem"
          className="object-contain p-3"
        />
      </div>

      <div className="flex flex-col gap-3 p-4">
        <p className="truncate text-sm font-medium">
          {file.name}
          {file.format ? `.${file.format}` : ""}
        </p>

        <div className="flex flex-col gap-1 text-xs text-muted-foreground">
          {file.width && file.height ? (
            <div className="flex justify-between">
              <span>Dimensi</span>
              <span className="text-foreground">
                {file.width} × {file.height}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span>Ukuran</span>
            <span className="text-foreground">{formatFileSize(file.size)}</span>
          </div>
          <div className="flex justify-between">
            <span>Diupload</span>
            <span className="text-foreground">{formatDate(file.createdAt)}</span>
          </div>
        </div>

        <Button variant="outline" size="sm" className="w-full" onClick={handleCopy}>
          {isCopied ? (
            <>
              <Check className="size-3.5 text-primary" aria-hidden="true" />
              URL Disalin!
            </>
          ) : (
            <>
              <Copy className="size-3.5" aria-hidden="true" />
              Salin URL
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="w-full text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="size-3.5" aria-hidden="true" />
          Hapus File
        </Button>
      </div>
    </aside>
  );
}
