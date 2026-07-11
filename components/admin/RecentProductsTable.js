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
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import ProductStatusBadge from "@/components/product/ProductStatusBadge";
import EmptyState from "@/components/common/EmptyState";
import { formatDate } from "@/utils/date";

export default function RecentProductsTable({ products }) {
  if (!products.length) {
    return (
      <EmptyState
        message="Rak masih kosong. Tambah produk pertamamu!"
        actionLabel="Tambah Produk"
        actionHref="/admin/products/new"
      />
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produk</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Diupdate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id} className="group">
              <TableCell>
                <Link href={`/admin/products/${product.id}`} className="flex items-center gap-3">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={36}
                      height={36}
                      className="size-9 shrink-0 rounded-md object-cover"
                    />
                  ) : (
                    <div className="size-9 shrink-0 rounded-md bg-muted" />
                  )}
                  <span className="max-w-[220px] truncate font-medium group-hover:text-primary">
                    {product.title}
                  </span>
                </Link>
              </TableCell>
              <TableCell>
                <MarketplaceBadge marketplace={product.marketplace} />
              </TableCell>
              <TableCell>
                <ProductStatusBadge status={product.status} />
              </TableCell>
              <TableCell className="whitespace-nowrap text-muted-foreground">
                {formatDate(product.updatedAt)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
