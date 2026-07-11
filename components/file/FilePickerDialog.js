"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import FileGrid from "@/components/file/FileGrid";
import FileUploadZone from "@/components/file/FileUploadZone";
import EmptyState from "@/components/common/EmptyState";

export default function FilePickerDialog({ open, onOpenChange, onSelect, multiple = false }) {
  const [files, setFiles] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setFiles(null);
      setSelectedIds(new Set());
    }
  }

  const isLoading = files === null;

  useEffect(() => {
    if (!open) return;

    let active = true;
    fetch("/api/files")
      .then((response) => response.json())
      .then((result) => {
        if (active) setFiles(result.success ? result.data : []);
      })
      .catch(() => {
        if (active) setFiles([]);
      });

    return () => {
      active = false;
    };
  }, [open]);

  function finish(selectedFiles) {
    if (!selectedFiles.length) return;
    onSelect(selectedFiles);
    onOpenChange(false);
  }

  function handleUploaded(file) {
    setFiles((prev) => [file, ...(prev ?? [])]);

    if (!multiple) {
      finish([file]);
      return;
    }
    setSelectedIds((prev) => new Set(prev).add(file.id));
  }

  function handleToggle(id) {
    if (!multiple) {
      finish((files ?? []).filter((file) => file.id === id));
      return;
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Pilih dari File Manager</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <FileUploadZone onUploaded={handleUploaded} />

          {isLoading ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Memuat file...</p>
          ) : files.length ? (
            <FileGrid files={files} selectedIds={selectedIds} onToggle={handleToggle} />
          ) : (
            <EmptyState message="Belum ada file. Upload gambar pertamamu di atas." />
          )}

          {multiple ? (
            <div className="flex justify-end border-t border-dashed pt-4">
              <Button
                type="button"
                disabled={!selectedIds.size}
                onClick={() => finish((files ?? []).filter((file) => selectedIds.has(file.id)))}
              >
                Gunakan {selectedIds.size || ""} gambar
              </Button>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
