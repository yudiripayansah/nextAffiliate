import Link from "next/link";
import { getCategories } from "@/services/category/category.service";
import { Button } from "@/components/ui/button";
import CategoryTable from "@/components/category/CategoryTable";

export const metadata = {
  title: "Categories",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">Tambah Category</Link>
        </Button>
      </div>

      <CategoryTable categories={categories} />
    </div>
  );
}
