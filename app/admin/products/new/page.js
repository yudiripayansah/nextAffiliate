import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/product/ProductForm";

export const metadata = {
  title: "Tambah Produk",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Tambah Produk" description="Produk baru untuk katalog affiliate." />
      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}
