import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

const CARD_POSITION_CLASSES = [
  "absolute left-0 top-12 -rotate-6 hover:rotate-0",
  "absolute left-28 top-0 rotate-3 hover:rotate-0",
  "absolute left-16 top-32 -rotate-2 hover:rotate-0",
];

export default function HeroProductPeek({ products }) {
  if (!products.length) return null;

  return (
    <div className="relative hidden h-96 w-full max-w-sm lg:block">
      {products.slice(0, 3).map((product, index) => (
        <Link
          key={product.id}
          href={`/product/${product.slug}`}
          style={{ zIndex: index }}
          className={`${CARD_POSITION_CLASSES[index]} w-44 overflow-hidden rounded-xl border-2 border-card bg-card shadow-xl transition-transform duration-300 hover:z-20 hover:scale-105`}
        >
          <div className="relative aspect-square w-full bg-muted">
            {product.thumbnail ? (
              <Image src={product.thumbnail} alt={product.title} fill sizes="176px" className="object-cover" />
            ) : null}
          </div>
          <div className="p-2">
            <p className="line-clamp-1 text-xs font-medium text-foreground">{product.title}</p>
            <p className="font-price text-sm font-bold text-primary">{formatPrice(product.price)}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
