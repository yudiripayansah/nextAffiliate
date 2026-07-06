import Link from "next/link";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  { label: "Tambah Produk", href: "/admin/products/new" },
  { label: "Import Produk", href: "/admin/import" },
  { label: "Tambah Kategori", href: "/admin/categories/new" },
  { label: "Tambah Collection", href: "/admin/collections" },
];

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-2">
      {ACTIONS.map(({ label, href }) => (
        <Button key={href} asChild variant="outline" size="sm">
          <Link href={href}>{label}</Link>
        </Button>
      ))}
    </div>
  );
}
