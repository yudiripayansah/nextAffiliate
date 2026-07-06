import AdminMobileSidebar from "@/components/admin/AdminMobileSidebar";
import LogoutButton from "@/components/admin/LogoutButton";

export default function AdminHeader({ admin }) {
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3 lg:px-6">
      <div className="flex items-center gap-2">
        <AdminMobileSidebar />
        <span className="text-sm text-muted-foreground">{admin.email}</span>
      </div>
      <LogoutButton />
    </header>
  );
}
