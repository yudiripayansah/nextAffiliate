import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
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
            <TableHead>Title</TableHead>
            <TableHead>Marketplace</TableHead>
            <TableHead>Click</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.title}</TableCell>
              <TableCell>
                <MarketplaceBadge marketplace={product.marketplace} />
              </TableCell>
              <TableCell>{product.clickCount ?? 0}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
