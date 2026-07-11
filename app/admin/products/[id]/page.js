import { notFound } from "next/navigation";
import { getProduct } from "@/services/product/product.service";
import { getCategories } from "@/services/category/category.service";
import { getCollections } from "@/services/collection/collection.service";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductForm from "@/components/product/ProductForm";

export const metadata = {
  title: "Edit Produk",
  robots: { index: false, follow: false },
};

export default async function EditProductPage({ params }) {
  const { id } = await params;
  const [product, categories, collections] = await Promise.all([
    getProduct(id),
    getCategories(),
    getCollections(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Edit Produk" description={product.title} />
      <ProductForm initialProduct={product} categories={categories} collections={collections} />
    </div>
  );
}
