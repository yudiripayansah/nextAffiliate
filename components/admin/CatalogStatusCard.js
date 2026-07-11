import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { key: "published", label: "Published", dotClass: "bg-trust", href: "/admin/products?status=published" },
  { key: "draft", label: "Draft", dotClass: "bg-chart-3", href: "/admin/products?status=draft" },
  { key: "archived", label: "Archived", dotClass: "bg-muted-foreground/40", href: "/admin/products?status=archived" },
];

export default function CatalogStatusCard({ productStats, categoryCount, collectionCount }) {
  const total = productStats.total || 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Status Katalog</CardTitle>
        <CardDescription>
          <span className="font-price font-bold text-foreground">{total}</span> produk total
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex h-2 overflow-hidden rounded-full bg-muted" role="presentation">
          {SEGMENTS.map(({ key, dotClass }) => {
            const count = productStats[key] || 0;
            if (!count || !total) return null;
            return (
              <div
                key={key}
                className={cn("h-full", dotClass)}
                style={{ width: `${(count / total) * 100}%` }}
              />
            );
          })}
        </div>

        <div className="flex flex-col">
          {SEGMENTS.map(({ key, label, dotClass, href }) => (
            <Link
              key={key}
              href={href}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted"
            >
              <span className={cn("size-2 rounded-full", dotClass)} aria-hidden="true" />
              <span className="flex-1 text-muted-foreground">{label}</span>
              <span className="font-price font-bold">{productStats[key] || 0}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-dashed pt-3 text-xs">
          <Link
            href="/admin/categories"
            className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            <span className="font-price font-bold">{categoryCount}</span> kategori
          </Link>
          <Link
            href="/admin/collections"
            className="rounded-full bg-secondary px-2.5 py-1 font-medium text-secondary-foreground transition-colors hover:bg-muted"
          >
            <span className="font-price font-bold">{collectionCount}</span> collection
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
