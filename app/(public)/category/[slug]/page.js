import { notFound } from "next/navigation";
import Image from "next/image";
import { getCategoryBySlug } from "@/services/category/category.service";
import { getProducts } from "@/services/product/product.service";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSortSelect from "@/components/product/ProductSortSelect";
import PaginationControls from "@/components/common/PaginationControls";
import JsonLd from "@/components/common/JsonLd";
import { buildCollectionPageSchema, buildBreadcrumbSchema } from "@/utils/jsonLd";
import { renderCategoryIcon } from "@/utils/categoryIcon";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) return {};

  return {
    title: category.seoTitle || category.name,
    description: category.seoDescription || category.description,
    alternates: { canonical: `/category/${category.slug}` },
  };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const { sort, after } = await searchParams;

  const category = await getCategoryBySlug(slug);
  if (!category || !category.published) {
    notFound();
  }

  const afterStack = after ? after.split(",").filter(Boolean) : [];
  const { products, hasMore, lastId } = await getProducts({
    categoryId: category.id,
    status: "published",
    sort: sort || "created",
    afterId: afterStack.at(-1),
    limitCount: 20,
  });

  const breadcrumbItems = [{ label: "Home", href: "/" }, { label: category.name }];

  return (
    <Container className="flex flex-col gap-6 py-8">
      <JsonLd
        data={buildCollectionPageSchema({
          name: category.name,
          description: category.description,
          url: `/category/${category.slug}`,
        })}
      />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />

      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col gap-4 rounded-3xl bg-brand/25 p-6 sm:flex-row sm:items-center dark:bg-card">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            width={64}
            height={64}
            className="rounded-full object-cover"
          />
        ) : (
          <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-card dark:bg-secondary">
            {renderCategoryIcon(category, 32)}
          </span>
        )}
        <div>
          <h1 className="font-display text-2xl font-bold">{category.name}</h1>
          {category.description ? (
            <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
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
