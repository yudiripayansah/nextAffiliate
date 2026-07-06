"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CollectionTable from "@/components/collection/CollectionTable";
import CollectionForm from "@/components/collection/CollectionForm";

export default function CollectionsManager({ collections }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  function openAddDialog() {
    setEditingCollection(null);
    setDialogOpen(true);
  }

  function openEditDialog(collection) {
    setEditingCollection(collection);
    setDialogOpen(true);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Collections</h1>
        <Button onClick={openAddDialog}>Tambah Collection</Button>
      </div>

      <CollectionTable collections={collections} onEdit={openEditDialog} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCollection ? "Edit Collection" : "Tambah Collection"}</DialogTitle>
          </DialogHeader>
          <CollectionForm
            initialCollection={editingCollection}
            onSuccess={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
