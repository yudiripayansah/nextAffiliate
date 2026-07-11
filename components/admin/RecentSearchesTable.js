import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyState from "@/components/common/EmptyState";
import { formatDate } from "@/utils/date";

export default function RecentSearchesTable({ searches }) {
  if (!searches.length) {
    return <EmptyState message="Belum ada pencarian." />;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kata Kunci</TableHead>
            <TableHead>Hasil</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searches.map((search) => (
            <TableRow key={search.id}>
              <TableCell className="font-medium">&ldquo;{search.keyword}&rdquo;</TableCell>
              <TableCell className="font-price">{search.resultCount}</TableCell>
              <TableCell className="text-muted-foreground">{formatDate(search.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
