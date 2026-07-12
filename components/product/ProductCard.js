import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { MARKETPLACE_LABELS } from "@/constants/marketplace";
import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/lib/utils";

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPercentage > 0;

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : null}

        {hasDiscount ? (
          <span className="absolute left-2 top-2 rounded-full bg-sale px-2 py-1 text-[11px] font-extrabold leading-none text-sale-foreground">
            -{product.discountPercentage}%
          </span>
        ) : null}

        <span className="absolute bottom-2 left-2 rounded-full bg-card/90 px-2 py-0.5 text-[10px] font-bold text-foreground backdrop-blur-sm">
          {MARKETPLACE_LABELS[product.marketplace] ?? product.marketplace}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
          {product.title}
        </h3>

        <div className="mt-auto flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <p className={cn("text-base font-extrabold", hasDiscount ? "text-sale" : "text-foreground")}>
              {formatPrice(product.price)}
            </p>
            {hasDiscount ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </p>
            ) : null}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            {product.rating ? (
              <span className="flex items-center gap-1">
                <Star className="size-3.5 fill-brand text-brand" />
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
