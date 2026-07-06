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
            <TableHead>Keyword</TableHead>
            <TableHead>Result Count</TableHead>
            <TableHead>Search Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {searches.map((search) => (
            <TableRow key={search.id}>
              <TableCell className="font-medium">{search.keyword}</TableCell>
              <TableCell>{search.resultCount}</TableCell>
              <TableCell>{formatDate(search.createdAt)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
