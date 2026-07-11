"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { downloadCsv } from "@/utils/exportCsv";

const PRODUCT_CSV_COLUMNS = [
  { key: "title", label: "Title" },
  { key: "slug", label: "Slug" },
  { key: "marketplace", label: "Marketplace" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
  { key: "affiliateUrl", label: "Affiliate URL" },
];

export default function BulkActionsBar({ selectedIds, selectedProducts, categories, onDone }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [error, setError] = useState("");

  async function runBulkAction(body) {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/products/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, ...body }),
      });
      const result = await response.json();

      if (!result.success) {
        setError(result.message || "Aksi gagal. Coba lagi.");
        return false;
      }

      onDone();
      router.refresh();
      return true;
    } catch {
      setError("Aksi gagal. Periksa koneksi lalu coba lagi.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleBulkDelete() {
    const success = await runBulkAction({ action: "delete" });
    if (success) setDeleteOpen(false);
  }

  function handleExportCsv() {
    downloadCsv("products.csv", selectedProducts, PRODUCT_CSV_COLUMNS);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border bg-muted/50 p-3">
      <span className="text-sm font-medium">{selectedIds.length} dipilih</span>

      <Button size="sm" variant="outline" disabled={isSubmitting} onClick={() => runBulkAction({ action: "publish" })}>
        Publish
      </Button>
      <Button size="sm" variant="outline" disabled={isSubmitting} onClick={() => runBulkAction({ action: "unpublish" })}>
        Unpublish
      </Button>
      <Button size="sm" variant="outline" disabled={isSubmitting} onClick={() => runBulkAction({ action: "archive" })}>
        Archive
      </Button>

      <Select onValueChange={(categoryId) => runBulkAction({ action: "changeCategory", categoryId })}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Change Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button size="sm" variant="outline" onClick={handleExportCsv}>
        Export CSV
      </Button>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogTrigger
          render={<Button size="sm" variant="destructive" disabled={isSubmitting} />}
        >
          <Trash2 className="size-4" aria-hidden="true" />
          Delete
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {selectedIds.length} produk?</AlertDialogTitle>
            <AlertDialogDescription>
              Produk akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleBulkDelete} disabled={isSubmitting}>
              {isSubmitting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error ? (
        <p role="alert" className="w-full text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
