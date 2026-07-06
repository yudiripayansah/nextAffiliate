import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import MarketplaceBadge from "@/components/product/MarketplaceBadge";
import { formatPrice } from "@/utils/formatPrice";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        <div className="absolute left-2 top-2">
          <MarketplaceBadge marketplace={product.marketplace} />
        </div>

        {hasDiscount ? (
          <div className="absolute right-2 top-2 rounded-full bg-destructive px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
            -{product.discountPercentage}%
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.brand ? (
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {product.brand}
          </p>
        ) : null}

        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-medium text-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>

        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className="text-base font-bold text-foreground">{formatPrice(product.price)}</p>
            {hasDiscount ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {product.rating ? (
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {product.rating}
              </span>
            ) : (
              <span />
            )}
            {product.sold ? <span>{product.sold} terjual</span> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
