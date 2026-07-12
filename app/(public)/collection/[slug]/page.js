import { notFound } from "next/navigation";
import Image from "next/image";
import { getCollectionBySlug } from "@/services/collection/collection.service";
import { getProducts } from "@/services/product/product.service";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSortSelect from "@/components/product/ProductSortSelect";
import PaginationControls from "@/components/common/PaginationControls";
import JsonLd from "@/components/common/JsonLd";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/utils/jsonLd";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) return {};

  return {
    title: collection.seoTitle || collection.name,
    description: collection.seoDescription || collection.description,
    alternates: { canonical: `/collection/${collection.slug}` },
  };
}

export default async function CollectionPage({ params, searchParams }) {
  const { slug } = await params;
  const { sort, after } = await searchParams;

  const collection = await getCollectionBySlug(slug);
  if (!collection || !collection.published) {
    notFound();
  }

  const afterStack = after ? after.split(",").filter(Boolean) : [];
  const { products, hasMore, lastId } = await getProducts({
    collectionId: collection.id,
    status: "published",
    sort: sort || "created",
    afterId: afterStack.at(-1),
    limitCount: 20,
  });

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: collection.name }];

  return (
    <Container className="flex flex-col gap-6 py-8">
      <JsonLd
        data={buildCollectionPageSchema({
          name: collection.name,
          description: collection.description,
          url: `/collection/${collection.slug}`,
        })}
      />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col gap-4 rounded-3xl bg-brand/25 p-6 sm:flex-row sm:items-center dark:bg-card">
        {collection.image ? (
          <Image
            src={collection.image}
            alt={collection.name}
            width={80}
            height={80}
            className="rounded-xl object-cover"
          />
        ) : null}
        <div>
          <h1 className="font-display text-2xl font-bold">{collection.name}</h1>
          {collection.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end">
        <ProductSortSelect />
      </div>

      <ProductGrid products={products} />

      <PaginationControls hasMore={hasMore} lastId={lastId} />
    </Container>
  );
}
