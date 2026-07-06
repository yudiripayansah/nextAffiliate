import Image from "next/image";
import Link from "next/link";
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
import { formatDate } from "@/utils/date";

export default function CategoryTable({ categories }) {
  if (!categories.length) {
    return <EmptyState message="Belum ada category." />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-md bg-muted" />
                )}
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell>
                <Badge variant={category.published ? "default" : "outline"}>
                  {category.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(category.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/categories/${category.id}`}>Edit</Link>
                  </Button>
                  <DeleteEntityButton
                    deleteUrl={`/api/categories/${category.id}`}
                    entityLabel="category"
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
