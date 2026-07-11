import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import ProductStatusBadge from "@/components/product/ProductStatusBadge";
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
    return (
      <EmptyState
        message="Rak masih kosong. Tambah produk pertamamu!"
        actionLabel="Tambah Produk"
        actionHref="/admin/products/new"
      />
    );
  }

  const allSelected = products.length > 0 && selectedIds.length === products.length;

  return (
    <div className="overflow-x-auto rounded-xl bg-card ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 pl-4">
              <Checkbox checked={allSelected} onCheckedChange={(checked) => onToggleSelectAll(checked)} />
            </TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diupdate</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="group">
              <TableCell className="pl-4">
                <Checkbox
                  checked={selectedIds.includes(product.id)}
                  onCheckedChange={(checked) => onToggleSelect(product.id, checked)}
                />
              </TableCell>
              <TableCell>
                <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="size-10 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-10 shrink-0 rounded-md bg-muted" />
                  )}
                  <span className="flex min-w-0 flex-col">
                    <span className="flex items-center gap-1.5">
                      <span className="max-w-[240px] truncate font-medium group-hover:text-primary">
                        {product.title}
                      </span>
                      {product.featured ? (
                        <Star className="size-3.5 shrink-0 fill-chart-3 text-chart-3" aria-label="Featured" />
                      ) : null}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {categoryNameById[product.categoryId] ?? "Tanpa kategori"}
                    </span>
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <MarketplaceBadge marketplace={product.marketplace} />
              </TableCell>
              <TableCell className="font-price font-medium whitespace-nowrap">
                {formatPrice(product.price)}
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(product.updatedAt)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    render={<Link href={`/admin/products/${product.id}`} />}
                    nativeButton={false}
                  >
                    Edit
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
