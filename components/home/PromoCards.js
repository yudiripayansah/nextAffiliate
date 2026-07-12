import Image from "next/image";
import Link from "next/link";

export default function PromoCards({ collections }) {
  const cards = collections.slice(0, 2);
  if (!cards.length) return null;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
      {cards.map((collection) => (
        <Link
          key={collection.id}
          href={`/collection/${collection.slug}`}
          className="group relative min-h-32 overflow-hidden rounded-3xl bg-accent lg:min-h-0 lg:flex-1"
        >
          {collection.image ? (
            <Image
              src={collection.image}
              alt={collection.name}
              fill
              sizes="(max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : null}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-4">
            <p className="font-display text-base font-bold text-white">{collection.name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
