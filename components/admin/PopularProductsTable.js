import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import RankBadge from "@/components/admin/RankBadge";
import EmptyState from "@/components/common/EmptyState";

export default function PopularProductsTable({ products }) {
  if (!products.length) {
    return <EmptyState message="Belum ada data klik." />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Produk</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead className="text-right">Klik</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id}>
              <TableCell>
                <RankBadge rank={index + 1} />
              </TableCell>
              <TableCell className="max-w-[240px] truncate font-medium">{product.title}</TableCell>
              <TableCell>
                <MarketplaceBadge marketplace={product.marketplace} />
              </TableCell>
              <TableCell className="text-right font-price font-bold">{product.clickCount ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
