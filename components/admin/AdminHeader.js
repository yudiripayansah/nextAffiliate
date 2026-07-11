import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";
import AdminPageTitle from "@/components/admin/AdminPageTitle";
import AdminUserMenu from "@/components/admin/AdminUserMenu";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function AdminHeader({ admin }) {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b bg-background/90 px-4 py-2.5 backdrop-blur lg:px-6">
      <div className="flex items-center gap-2">
        <AdminMobileSidebar />
        <AdminPageTitle />
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          className="hidden sm:inline-flex"
          render={<Link href="/admin/products/new" />}
          nativeButton={false}
        >
          <Plus className="size-4" aria-hidden="true" />
          Produk Baru
        </Button>
        <ThemeToggle />
        <AdminUserMenu email={admin.email} />
      </div>
    </header>
  );
}
