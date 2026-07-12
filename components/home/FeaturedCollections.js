import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/common/EmptyState";

export default function FeaturedCollections({ collections }) {
  if (!collections.length) {
    return <EmptyState message="Belum ada collection." />;
  }

  return (
    <div className="flex snap-x gap-4 overflow-x-auto pb-2">
      {collections.map((collection) => (
        <Link
          key={collection.id}
          href={`/collection/${collection.slug}`}
          className="relative aspect-video w-72 shrink-0 snap-start overflow-hidden rounded-3xl bg-muted"
        >
          {collection.image ? (
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="256px"
              className="object-cover"
            />
          ) : null}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3">
            <p className="font-display text-base font-bold text-white">{collection.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
