import AdminNav from "@/components/admin/AdminNav";

export default function AdminSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background p-4 lg:flex lg:flex-col">
      <div className="mb-6 px-3 text-lg font-semibold">Affiliate CMS</div>
      <AdminNav />
    </aside>
  );
}
