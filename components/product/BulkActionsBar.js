"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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

  async function runBulkAction(body) {
    setIsSubmitting(true);
    await fetch("/api/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selectedIds, ...body }),
    });
    setIsSubmitting(false);
    onDone();
    router.refresh();
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
        Delete
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
    </div>
  );
}
