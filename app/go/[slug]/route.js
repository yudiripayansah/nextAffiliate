import { notFound } from "next/navigation";
import { getProductBySlug } from "@/services/product/product.service";
import { logClick } from "@/services/analytics/analytics.service";

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  await logClick(product, request);

  return Response.redirect(product.affiliateUrl, 302);
}
