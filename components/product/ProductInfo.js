import { Star } from "lucide-react";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import MarketplaceButton from "@/components/product/MarketplaceButton";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductInfo({ product, categoryName }) {
  return (
    <div className="flex flex-col gap-4">
      <MarketplaceBadge marketplace={product.marketplace} />

      <h1 className="text-2xl font-semibold">{product.title}</h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {product.brand ? <span>Brand: {product.brand}</span> : null}
        {categoryName ? <span>Category: {categoryName}</span> : null}
        {product.rating ? (
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-yellow-400 text-yellow-400" />
            {product.rating}
          </span>
        ) : null}
        {product.sold ? <span>{product.sold} terjual</span> : null}
      </div>

      <div className="flex items-baseline gap-3">
        <p className="text-3xl font-bold">{formatPrice(product.price)}</p>
        {product.originalPrice && product.originalPrice > product.price ? (
          <>
            <p className="text-lg text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
            <span className="text-sm font-medium text-destructive">
              -{product.discountPercentage}%
            </span>
          </>
        ) : null}
      </div>

      {product.shortDescription ? (
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
      ) : null}

      <MarketplaceButton slug={product.slug} marketplace={product.marketplace} />
    </div>
  );
}
