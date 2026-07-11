import { Star } from "lucide-react";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import MarketplaceButton from "@/components/product/MarketplaceButton";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductInfo({ product, categoryName }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const savings = hasDiscount ? product.originalPrice - product.price : 0;

  return (
    <div className="flex flex-col gap-4">
      <MarketplaceBadge marketplace={product.marketplace} />

      <h1 className="text-2xl font-bold">{product.title}</h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {product.brand ? <span>{product.brand}</span> : null}
        {categoryName ? <span>{categoryName}</span> : null}
        {product.rating ? (
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-trust text-trust" />
            {product.rating}
          </span>
        ) : null}
        {product.sold ? <span>{product.sold} terjual</span> : null}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <p className="font-price text-3xl font-bold text-foreground">{formatPrice(product.price)}</p>
          {hasDiscount ? (
            <p className="font-price text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          ) : null}
        </div>

        {hasDiscount ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-md border-2 border-dashed border-primary/40 bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary">
            Hemat <span className="font-price">{formatPrice(savings)}</span> dari harga normal
          </span>
        ) : null}
      </div>

      {product.shortDescription ? (
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
      ) : null}

      <MarketplaceButton slug={product.slug} marketplace={product.marketplace} />
    </div>
  );
}
