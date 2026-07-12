import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/services/product/product.service";
import { getCategory } from "@/services/category/category.service";
import Container from "@/components/layout/Container";
import Breadcrumb from "@/components/layout/Breadcrumb";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductBuyBar from "@/components/product/ProductBuyBar";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import ProductFaq from "@/components/product/ProductFaq";
import RelatedProducts from "@/components/product/RelatedProducts";
import JsonLd from "@/components/common/JsonLd";
import { buildProductSchema, buildFaqSchema, buildBreadcrumbSchema } from "@/utils/jsonLd";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return {};

  return {
    title: product.seoTitle || product.title,
    description: product.seoDescription || product.shortDescription,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.seoTitle || product.title,
      description: product.seoDescription || product.shortDescription,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const category = product.categoryId ? await getCategory(product.categoryId) : null;
  const { products: relatedCandidates } = await getProducts({
    categoryId: product.categoryId,
    status: "published",
    limitCount: 9,
  });
  const relatedProducts = relatedCandidates.filter((item) => item.id !== product.id).slice(0, 8);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    ...(category ? [{ label: category.name, href: `/category/${category.slug}` }] : []),
    { label: product.title },
  ];
  const faqSchema = buildFaqSchema(product.faq);

  return (
    <Container className="flex flex-col gap-8 py-8 pb-24 lg:pb-8">
      <JsonLd data={buildProductSchema(product)} />
      <JsonLd data={buildBreadcrumbSchema(breadcrumbItems)} />
      {faqSchema ? <JsonLd data={faqSchema} /> : null}

      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductGallery images={product.images} title={product.title} />
        <ProductInfo product={product} categoryName={category?.name} />
      </div>

      {product.description ? (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">Deskripsi</h2>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{product.description}</p>
        </div>
      ) : null}

      <ProductSpecifications specifications={product.specifications} />
      <ProductFaq faq={product.faq} />
      <RelatedProducts products={relatedProducts} />

      <ProductBuyBar product={product} />
    </Container>
  );
}
