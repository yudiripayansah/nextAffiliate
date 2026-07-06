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
import { Checkbox } from "@/components/ui/checkbox";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import DuplicateProductButton from "@/components/product/DuplicateProductButton";
import DeleteEntityButton from "@/components/admin/DeleteEntityButton";
import EmptyState from "@/components/common/EmptyState";
import { formatPrice } from "@/utils/formatPrice";
import { formatDate } from "@/utils/date";

export default function ProductTable({
  products,
  categoryNameById,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) {
  if (!products.length) {
    return <EmptyState message="Belum ada produk." />;
  }

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox checked={allSelected} onCheckedChange={(checked) => onToggleSelectAll(checked)} />
            </TableHead>
            <TableHead>Thumbnail</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={(checked) => onToggleSelect(product.id, checked)}
                />
              </TableCell>
              <TableCell>
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="size-10 rounded-md bg-muted" />
                )}
              </TableCell>
              <TableCell className="max-w-[200px] truncate font-medium">{product.title}</TableCell>
              <TableCell>
                <MarketplaceBadge marketplace={product.marketplace} />
              </TableCell>
              <TableCell>{categoryNameById[product.categoryId] ?? "-"}</TableCell>
              <TableCell>{formatPrice(product.price)}</TableCell>
              <TableCell>
                <Badge variant={product.status === "published" ? "default" : "outline"}>
                  {product.status === "published" ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>{product.featured ? <Badge variant="secondary">Featured</Badge> : null}</TableCell>
              <TableCell>{formatDate(product.updatedAt)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>Edit</Link>
                  </Button>
                  <DuplicateProductButton productId={product.id} />
                  <DeleteEntityButton
                    deleteUrl={`/api/products/${product.id}`}
                    entityLabel="product"
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
