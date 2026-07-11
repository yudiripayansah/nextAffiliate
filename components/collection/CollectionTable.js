import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import EmptyState from "@/components/common/EmptyState";

export default function CollectionTable({ collections, onEdit }) {
  if (!collections.length) {
    return <EmptyState message="Belum ada collection." />;
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Collection</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell className="pl-4">
                <button
                  type="button"
                  onClick={() => onEdit(collection)}
                  className="flex items-center gap-3 text-left hover:text-primary"
                >
                  {collection.image ? (
                    <Image
                      src={collection.image}
                      alt={collection.name}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-10 shrink-0 rounded-md bg-muted" />
                  )}
                  <span className="font-medium">{collection.name}</span>
                </button>
              </TableCell>
              <TableCell className="text-muted-foreground">{collection.slug}</TableCell>
              <TableCell>
                {collection.featured ? <Badge variant="secondary">Featured</Badge> : null}
              </TableCell>
              <TableCell>
                <Badge variant={collection.published ? "default" : "outline"}>
                  {collection.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(collection)}>
                    Edit
                  </Button>
                  <DeleteEntityButton
                    deleteUrl={`/api/collections/${collection.id}`}
                    entityLabel="collection"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
