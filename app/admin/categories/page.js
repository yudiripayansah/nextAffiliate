import Link from "next/link";
import { Plus } from "lucide-react";
import { getCategories } from "@/services/category/category.service";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import CategoryTable from "@/components/category/CategoryTable";

export const metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Categories" description="Kelompokkan produk agar mudah ditemukan.">
        <Button render={<Link href="/admin/categories/new" />} nativeButton={false}>
          <Plus className="size-4" aria-hidden="true" />
          Tambah Category
        </Button>
      </AdminPageHeader>

      <CategoryTable categories={categories} />
    </div>
  );
}
