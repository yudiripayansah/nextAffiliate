import { getProducts } from "@/services/product/product.service";
import { logSearchQuery } from "@/services/analytics/analytics.service";
import Container from "@/components/layout/Container";
import ProductGrid from "@/components/product/ProductGrid";
import EmptyState from "@/components/common/EmptyState";

export const metadata = {
  title: "Search",
  robots: { index: false, follow: false },
};

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const keyword = q?.trim() ?? "";

  if (!keyword) {
    return (
      <Container className="flex flex-col gap-4 py-10">
        <EmptyState message="Ketik kata kunci untuk mencari produk." />
      </Container>
    );
  }

  const { products } = await getProducts({ search: keyword, status: "published", limitCount: 20 });
  await logSearchQuery(keyword, products.length);

  if (!products.length) {
    const { products: featuredProducts } = await getProducts({
      status: "published",
      sort: "click",
      limitCount: 8,
    });

    return (
      <Container className="flex flex-col gap-6 py-10">
        <EmptyState message={`Produk tidak ditemukan untuk "${keyword}".`} />
        {featuredProducts.length ? (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold">Coba lihat produk populer ini</h2>
            <ProductGrid products={featuredProducts} />
          </div>
        ) : null}
      </Container>
    );
  }

  return (
    <Container className="flex flex-col gap-4 py-10">
      <div>
        <h1 className="font-display text-xl font-bold">Hasil pencarian &quot;{keyword}&quot;</h1>
        <p className="text-sm text-muted-foreground">{products.length} produk ditemukan</p>
      </div>
      <ProductGrid products={products} />
    </Container>
  );
}
