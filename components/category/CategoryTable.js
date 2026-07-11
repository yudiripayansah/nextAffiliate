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
    return (
      <EmptyState
        message="Belum ada category. Buat yang pertama!"
        actionLabel="Tambah Category"
        actionHref="/admin/categories/new"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4">Category</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diupdate</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id} className="group">
              <TableCell className="pl-4">
                <Link href={`/admin/categories/${category.id}`} className="flex items-center gap-3">
                  {category.image ? (
                    <Image
                      src={category.image}
                      alt={category.name}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-10 shrink-0 rounded-md bg-muted" />
                  )}
                  <span className="font-medium group-hover:text-primary">{category.name}</span>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">{category.slug}</TableCell>
              <TableCell>
                <Badge variant={category.published ? "default" : "outline"}>
                  {category.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(category.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/admin/categories/${category.id}`} />}
                    nativeButton={false}
                  >
                    Edit
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
