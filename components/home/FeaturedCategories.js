import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import { renderCategoryIcon } from "@/utils/categoryIcon";

const CIRCLE_STYLES = ["bg-brand/30", "bg-accent", "bg-sale/15", "bg-primary/10", "bg-trust/15"];

export default function FeaturedCategories({ categories }) {
  if (!categories.length) {
    return <EmptyState message="Belum ada category." />;
  }

  return (
    <div className="flex snap-x gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-4 sm:overflow-visible md:grid-cols-6 lg:grid-cols-8">
      {categories.map((category, index) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group flex w-20 shrink-0 snap-start flex-col items-center gap-2 rounded-2xl p-2 text-center transition-colors hover:bg-accent sm:w-auto sm:p-3"
        >
          <span
            className={`flex size-16 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${CIRCLE_STYLES[index % CIRCLE_STYLES.length]}`}
          >
            {renderCategoryIcon(category, 30)}
          </span>
          <span className="text-xs font-bold text-foreground">{category.name}</span>
          {category.productCount != null ? (
            <span className="-mt-1.5 text-[10px] text-muted-foreground">
              {category.productCount} produk
            </span>
          ) : null}
        </Link>
      ))}
    </div>
  );
}
