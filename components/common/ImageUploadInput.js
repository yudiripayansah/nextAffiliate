"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import FilePickerDialog from "@/components/file/FilePickerDialog";

export default function ImageUploadInput({ id, label, value, onChange }) {
  const [pickerOpen, setPickerOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="flex items-center gap-3">
        {value ? (
          <Image
            src={value}
            alt={label}
            width={64}
            height={64}
            className="size-16 shrink-0 rounded-md border object-cover"
          />
        ) : (
          <div className="flex size-16 shrink-0 items-center justify-center rounded-md border border-dashed bg-muted/30">
            <ImagePlus className="size-5 text-muted-foreground/60" aria-hidden="true" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button id={id} type="button" variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
            <ImagePlus className="size-4" aria-hidden="true" />
            Pilih dari File Manager
          </Button>
          {value ? (
            <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
              <X className="size-4" aria-hidden="true" />
              Hapus
            </Button>
          ) : null}
        </div>
      </div>

      <FilePickerDialog
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={(files) => files[0] && onChange(files[0].url)}
      />
    </div>
  );
}
