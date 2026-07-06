import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";

export default function FeaturedCategories({ categories }) {
  if (!categories.length) {
    return <EmptyState message="Belum ada category." />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-accent">
            {category.image ? (
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <Tag className="size-8 text-primary/50" aria-hidden="true" />
            )}
          </div>
          <div className="p-3 text-center">
            <p className="text-sm font-semibold text-foreground group-hover:text-primary">{category.name}</p>
            <p className="text-xs text-muted-foreground">{category.productCount} produk</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
