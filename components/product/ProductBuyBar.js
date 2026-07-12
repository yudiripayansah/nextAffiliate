import Link from "next/link";
import { MARKETPLACE_LABELS, MARKETPLACE_BUTTON_CLASSES } from "@/constants/marketplace";
import { formatPrice } from "@/utils/formatPrice";
import { cn } from "@/lib/utils";

export default function ProductBuyBar({ product }) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur-sm lg:hidden">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          {hasDiscount ? (
            <p className="text-[11px] text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </p>
          ) : null}
          <p className={cn("text-lg font-extrabold leading-tight", hasDiscount ? "text-sale" : "text-foreground")}>
            {formatPrice(product.price)}
          </p>
        </div>
        <Link
          href={`/go/${product.slug}`}
          className={cn(
            "shrink-0 rounded-full px-6 py-3 text-sm font-extrabold",
            MARKETPLACE_BUTTON_CLASSES[product.marketplace] ?? "bg-primary text-primary-foreground"
          )}
        >
          Beli di {MARKETPLACE_LABELS[product.marketplace] ?? product.marketplace}
        </Link>
      </div>
    </div>
  );
}
