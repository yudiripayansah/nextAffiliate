"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RepeatableFieldList from "@/components/common/RepeatableFieldList";
import ProductBasicFields from "@/components/product/fields/ProductBasicFields";
import ProductMarketplaceFields from "@/components/product/fields/ProductMarketplaceFields";
import ProductCategoryFields from "@/components/product/fields/ProductCategoryFields";
import ProductPricingFields from "@/components/product/fields/ProductPricingFields";
import ProductImagesField from "@/components/product/fields/ProductImagesField";
import ProductTagsField from "@/components/product/fields/ProductTagsField";
import ProductSeoFields from "@/components/product/fields/ProductSeoFields";
import ProductPublishFields from "@/components/product/fields/ProductPublishFields";
import { slugify } from "@/utils/slugify";

const EMPTY_PRODUCT = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  marketplace: "",
  brand: "",
  affiliateUrl: "",
  originalUrl: "",
  categoryId: "",
  collectionIds: [],
  price: "",
  originalPrice: "",
  rating: "",
  sold: "",
  images: [],
  tags: [],
  seoTitle: "",
  seoDescription: "",
  specifications: [],
  faq: [],
  featured: false,
  published: false,
};

function toFormValues(product) {
  if (!product) return { ...EMPTY_PRODUCT };
  return {
    ...EMPTY_PRODUCT,
    ...product,
    published: product.status === "published",
  };
}

export default function ProductForm({ initialProduct, categories, collections }) {
  const router = useRouter();
  const [values, setValues] = useState(() => toFormValues(initialProduct));
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleTitleChange(title) {
    setValues((prev) => ({
      ...prev,
      title,
      slug: prev.slug ? prev.slug : slugify(title),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const isEdit = Boolean(initialProduct?.id);
    const url = isEdit ? `/api/products/${initialProduct.id}` : "/api/products";
    const response = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    if (!result.success) {
      setError(result.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <Card>
        <CardHeader>
          <CardTitle>Informasi Dasar</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductBasicFields values={values} onChange={handleChange} onTitleChange={handleTitleChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Marketplace</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductMarketplaceFields values={values} onChange={handleChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Category & Collection</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCategoryFields
            values={values}
            onChange={handleChange}
            categories={categories}
            collections={collections}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Harga</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductPricingFields values={values} onChange={handleChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductImagesField images={values.images} onChange={(images) => handleChange("images", images)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tags & SEO</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ProductTagsField values={values} onChange={handleChange} />
          <ProductSeoFields values={values} onChange={handleChange} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeatableFieldList
            label="Specifications"
            items={values.specifications}
            onChange={(specifications) => handleChange("specifications", specifications)}
            fields={[
              { key: "label", placeholder: "Nama spesifikasi" },
              { key: "value", placeholder: "Nilai" },
            ]}
            emptyItem={{ label: "", value: "" }}
            addLabel="Tambah Specification"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <RepeatableFieldList
            label="FAQ"
            items={values.faq}
            onChange={(faq) => handleChange("faq", faq)}
            fields={[
              { key: "question", placeholder: "Pertanyaan" },
              { key: "answer", placeholder: "Jawaban" },
            ]}
            emptyItem={{ question: "", answer: "" }}
            addLabel="Tambah FAQ"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductPublishFields values={values} onChange={handleChange} />
        </CardContent>
      </Card>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Product"}
        </Button>
      </div>
    </form>
  );
}
