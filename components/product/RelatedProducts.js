import ProductGrid from "@/components/product/ProductGrid";

export default function RelatedProducts({ products }) {
  if (!products.length) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Related Products</h2>
      <ProductGrid products={products} />
    </div>
  );
}
