"use client";

import { useState } from "react";
import ProductTable from "@/components/product/ProductTable";
import BulkActionsBar from "@/components/product/BulkActionsBar";

export default function ProductsManager({ products, categoryNameById, categories }) {
  const [selectedIds, setSelectedIds] = useState([]);

  function toggleSelect(id, checked) {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)));
  }

  function toggleSelectAll(checked) {
    setSelectedIds(checked ? products.map((product) => product.id) : []);
  }

  const selectedProducts = products.filter((product) => selectedIds.includes(product.id));

  return (
    <div className="flex flex-col gap-4">
      {selectedIds.length ? (
        <BulkActionsBar
          selectedIds={selectedIds}
          selectedProducts={selectedProducts}
          categories={categories}
          onDone={() => setSelectedIds([])}
        />
      ) : null}

      <ProductTable
        products={products}
        categoryNameById={categoryNameById}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />
    </div>
  );
}
