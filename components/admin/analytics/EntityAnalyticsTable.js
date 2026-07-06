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
            <TableHead>Product Count</TableHead>
            <TableHead>Click Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{item.productCount}</TableCell>
              <TableCell>{item.totalClicks}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
