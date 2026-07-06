import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import ProductForm from "@/components/product/ProductForm";

export const metadata = {
  title: "Tambah Produk",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const [categories, collections] = await Promise.all([getCategories(), getCollections()]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Tambah Produk</h1>
      <ProductForm categories={categories} collections={collections} />
    </div>
  );
}
