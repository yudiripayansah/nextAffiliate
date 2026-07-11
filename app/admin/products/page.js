import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/services/product/product.service";
import { getCategories } from "@/services/category/category.service";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import ProductsManager from "@/components/product/ProductsManager";
import AdminSearchInput from "@/components/admin/AdminSearchInput";
import ProductFiltersBar from "@/components/product/ProductFiltersBar";
import PageSizeSelect from "@/components/common/PageSizeSelect";
import PaginationControls from "@/components/common/PaginationControls";

export const metadata = {
  title: "Products",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage({ searchParams }) {
  const params = await searchParams;
  const afterStack = params.after ? params.after.split(",").filter(Boolean) : [];
  const limitCount = Number(params.limit) || 20;

  const [{ products, hasMore, lastId }, categories] = await Promise.all([
    getProducts({
      search: params.q,
      marketplace: params.marketplace,
      categoryId: params.categoryId,
      status: params.status,
      sort: params.sort,
      limitCount,
      afterId: afterStack.at(-1),
    }),
    getCategories(),
  ]);
  const categoryNameById = Object.fromEntries(categories.map((category) => [category.id, category.name]));

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="Products" description="Kelola katalog produk affiliate.">
        <Button render={<Link href="/admin/products/new" />} nativeButton={false}>
          <Plus className="size-4" aria-hidden="true" />
          Tambah Produk
        </Button>
      </AdminPageHeader>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <AdminSearchInput placeholder="Cari title, brand, tag..." />
        <ProductFiltersBar categories={categories} />
      </div>

      <ProductsManager products={products} categoryNameById={categoryNameById} categories={categories} />

      <div className="flex items-center justify-between">
        <PageSizeSelect />
        <PaginationControls hasMore={hasMore} lastId={lastId} />
      </div>
    </div>
  );
}
