import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/common/EmptyState";

export default function EntityAnalyticsTable({ entityLabel, items }) {
  if (!items.length) {
    return <EmptyState message={`Belum ada ${entityLabel.toLowerCase()}.`} />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{entityLabel}</TableHead>
            <TableHead className="text-right">Produk</TableHead>
            <TableHead className="text-right">Klik</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right font-price">{item.productCount}</TableCell>
              <TableCell className="text-right font-price font-bold">{item.totalClicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
