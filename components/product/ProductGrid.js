import ProductCard from "@/components/product/ProductCard";
import EmptyState from "@/components/common/EmptyState";

export default function ProductGrid({ products }) {
  if (!products.length) {
    return <EmptyState message="Belum ada produk." />;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
