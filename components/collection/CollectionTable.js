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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id}>
              <TableCell>
                {collection.image ? (
                  <Image
                    src={collection.image}
                    alt={collection.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-md bg-muted" />
                )}
              </TableCell>
              <TableCell className="font-medium">{collection.name}</TableCell>
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
                <div className="flex items-center gap-1">
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
