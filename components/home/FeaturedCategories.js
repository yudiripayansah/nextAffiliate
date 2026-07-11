import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";
import { renderCategoryIcon } from "@/utils/categoryIcon";

export default function FeaturedCategories({ categories }) {
  if (!categories.length) {
    return <EmptyState message="Belum ada category." />;
  }

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/category/${category.slug}`}
          className="group flex flex-col items-center gap-2 rounded-xl p-3 text-center transition-colors hover:bg-accent"
        >
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted transition-transform duration-200 group-hover:scale-105">
            {renderCategoryIcon(category, 28)}
          </span>
          <span className="text-xs font-medium text-foreground">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
