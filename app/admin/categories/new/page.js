import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoryForm from "@/components/category/CategoryForm";

export const metadata = {
  title: "Tambah Category",
  robots: { index: false, follow: false },
};

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Tambah Category" description="Kategori baru untuk katalog." />
      <CategoryForm />
    </div>
  );
}
