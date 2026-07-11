import Link from "next/link";
import { Tag, ExternalLink } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Affiliate CMS";

export default function AdminSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
      <Link
        href="/admin/dashboard"
        className="flex items-center gap-3 px-5 py-5 transition-opacity hover:opacity-80"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shadow-sm">
          <Tag className="size-4" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="font-display text-sm font-bold">{SITE_NAME}</span>
          <span className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/50">
            Back Office
          </span>
        </span>
      </Link>

      <div className="mx-5 border-t border-dashed border-sidebar-border" />

      <div className="flex-1 overflow-y-auto p-3">
        <AdminNav />
      </div>

      <div className="mx-5 border-t border-dashed border-sidebar-border" />

      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-3 px-5 py-4 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
      >
        <ExternalLink className="size-4 text-sidebar-foreground/50 transition-colors group-hover:text-sidebar-foreground" aria-hidden="true" />
        Lihat Situs
      </a>
    </aside>
  );
}
