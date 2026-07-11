"use client";

import { useMemo, useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "@/components/common/EmptyState";
import FileUploadZone from "@/components/file/FileUploadZone";
import FileGrid from "@/components/file/FileGrid";
import FileDetailPanel from "@/components/file/FileDetailPanel";
import FileDeleteDialog from "@/components/file/FileDeleteDialog";
import FilePagination from "@/components/file/FilePagination";
import { formatFileSize } from "@/utils/formatFileSize";

const PAGE_SIZES = [20, 50, 100];

export default function FileManager({ initialFiles }) {
  const [files, setFiles] = useState(initialFiles);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [deleteIds, setDeleteIds] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const totalPages = Math.max(1, Math.ceil(files.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedFiles = useMemo(
    () => files.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [files, currentPage, pageSize]
  );

  const allPageSelected = pagedFiles.length > 0 && pagedFiles.every((file) => selectedIds.has(file.id));
  const singleSelected =
    selectedIds.size === 1 ? (files.find((file) => selectedIds.has(file.id)) ?? null) : null;
  const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);

  function handleUploaded(file) {
    setFiles((prev) => [file, ...prev]);
    setPage(1);
  }

  function toggleFile(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllOnPage() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pagedFiles.forEach((file) => next.delete(file.id));
      else pagedFiles.forEach((file) => next.add(file.id));
      return next;
    });
  }

  function openDeleteDialog(ids) {
    setDeleteError("");
    setDeleteIds(ids);
  }

  async function handleConfirmDelete() {
    const ids = deleteIds ?? [];
    setIsDeleting(true);
    setDeleteError("");

    const results = await Promise.all(
      ids.map((id) => fetch(`/api/files/${id}`, { method: "DELETE" }).then((response) => response.json()))
    );

    const deletedIds = new Set(ids.filter((_, index) => results[index].success));
    const failedCount = ids.length - deletedIds.size;

    setFiles((prev) => prev.filter((file) => !deletedIds.has(file.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      deletedIds.forEach((id) => next.delete(id));
      return next;
    });
    setIsDeleting(false);

    if (failedCount) {
      setDeleteError(`${failedCount} file gagal dihapus.`);
    } else {
      setDeleteIds(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            <strong className="font-semibold text-foreground">{files.length}</strong> file
          </span>
          <span>
            <strong className="font-semibold text-foreground">{formatFileSize(totalSize)}</strong>{" "}
            digunakan
          </span>
        </div>

        {selectedIds.size > 0 ? (
          <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 text-sm">
            <span className="font-medium">{selectedIds.size} dipilih</span>
            <Button variant="destructive" size="sm" onClick={() => openDeleteDialog([...selectedIds])}>
              <Trash2 className="size-3.5" aria-hidden="true" />
              Hapus
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Batal
            </Button>
          </div>
        ) : null}
      </div>

      <FileUploadZone onUploaded={handleUploaded} />

      {files.length > 0 ? (
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground select-none">
            <Checkbox checked={allPageSelected} onCheckedChange={toggleAllOnPage} />
            Pilih semua di halaman ini
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} per halaman
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="flex items-start gap-4">
        <div className="flex-1">
          {files.length === 0 ? (
            <EmptyState message="Belum ada file. Upload file pertama Anda di atas." />
          ) : (
            <>
              <FileGrid files={pagedFiles} selectedIds={selectedIds} onToggle={toggleFile} />
              <FilePagination
                page={currentPage}
                total={files.length}
                perPage={pageSize}
                onChange={(nextPage) => {
                  setPage(nextPage);
                  setSelectedIds(new Set());
                }}
              />
            </>
          )}
        </div>

        {singleSelected ? (
          <FileDetailPanel
            file={singleSelected}
            onDelete={() => openDeleteDialog([singleSelected.id])}
          />
        ) : null}
      </div>

      <FileDeleteDialog
        open={Boolean(deleteIds)}
        count={deleteIds?.length ?? 0}
        isDeleting={isDeleting}
        error={deleteError}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open) setDeleteIds(null);
        }}
      />
    </div>
  );
}
