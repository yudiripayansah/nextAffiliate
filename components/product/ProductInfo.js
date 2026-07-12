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

      <h1 className="font-display text-2xl font-bold sm:text-3xl">{product.title}</h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {product.brand ? <span>{product.brand}</span> : null}
        {categoryName ? <span>{categoryName}</span> : null}
        {product.rating ? (
          <span className="flex items-center gap-1">
            <Star className="size-4 fill-brand text-brand" />
            {product.rating}
          </span>
        ) : null}
        {product.sold ? <span>{product.sold} terjual</span> : null}
      </div>

      <div className="flex flex-col gap-2 rounded-2xl bg-secondary/60 p-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className={hasDiscount ? "text-3xl font-extrabold text-sale" : "text-3xl font-extrabold text-foreground"}>
            {formatPrice(product.price)}
          </p>
          {hasDiscount ? (
            <>
              <p className="text-lg text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
              <span className="rounded-full bg-sale px-2 py-1 text-xs font-extrabold leading-none text-sale-foreground">
                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
              </span>
            </>
          ) : null}
        </div>

        {hasDiscount ? (
          <p className="text-sm font-semibold text-foreground">
            Hemat {formatPrice(savings)} dari harga normal
          </p>
        ) : null}
      </div>

      {product.shortDescription ? (
        <p className="text-sm text-muted-foreground">{product.shortDescription}</p>
      ) : null}

      <MarketplaceButton slug={product.slug} marketplace={product.marketplace} />
    </div>
  );
}
