import Link from "next/link";
import { PackagePlus, FolderPlus, Layers, BarChart3, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ACTIONS = [
  { label: "Tambah Produk", description: "Produk affiliate baru", href: "/admin/products/new", icon: PackagePlus },
  { label: "Tambah Kategori", description: "Rapikan katalog", href: "/admin/categories/new", icon: FolderPlus },
  { label: "Kelola Collections", description: "Kurasi produk pilihan", href: "/admin/collections", icon: Layers },
  { label: "Lihat Analytics", description: "Klik & pencarian", href: "/admin/analytics", icon: BarChart3 },
];

export default function QuickActions() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
        <CardDescription>Langsung ke pekerjaan yang paling sering</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ACTIONS.map(({ label, description, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-muted"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="text-sm font-medium">{label}</span>
              <span className="truncate text-xs text-muted-foreground">{description}</span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden="true"
            />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
