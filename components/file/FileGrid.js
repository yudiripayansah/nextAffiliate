"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FileGrid({ files, selectedIds, onToggle }) {
  return (
    <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {files.map((file) => {
        const isSelected = selectedIds.has(file.id);

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onToggle(file.id)}
            aria-pressed={isSelected}
            aria-label={file.name || "File"}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
              isSelected
                ? "border-primary ring-2 ring-primary ring-offset-1"
                : "border-transparent hover:border-border"
            )}
          >
            <Image
              src={file.url}
              alt={file.name || "File"}
              fill
              sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 16vw"
              className="object-cover"
            />
            <span
              className={cn(
                "absolute top-1.5 left-1.5 flex size-5 items-center justify-center rounded-full border-2 transition-all",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/50 bg-background/80 opacity-0 group-hover:opacity-100"
              )}
            >
              {isSelected ? <Check className="size-3" strokeWidth={3} aria-hidden="true" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
