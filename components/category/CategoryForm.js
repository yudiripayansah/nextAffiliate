"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import ImageUploadInput from "@/components/common/ImageUploadInput";
import { slugify } from "@/utils/slugify";

const EMPTY_CATEGORY = {
  name: "",
  slug: "",
  description: "",
  image: "",
  icon: "",
  seoTitle: "",
  seoDescription: "",
  sortOrder: 0,
  published: false,
};

export default function CategoryForm({ initialCategory }) {
  const router = useRouter();
  const [values, setValues] = useState({ ...EMPTY_CATEGORY, ...initialCategory });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleNameChange(name) {
    setValues((prev) => ({
      ...prev,
      name,
      slug: prev.slug ? prev.slug : slugify(name),
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const isEdit = Boolean(initialCategory?.id);
    const url = isEdit ? `/api/categories/${initialCategory.id}` : "/api/categories";
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

    router.push("/admin/categories");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(event) => handleNameChange(event.target.value)}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={values.slug}
            onChange={(event) => handleChange("slug", slugify(event.target.value))}
            required
          />
        </div>

        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={values.description}
            onChange={(event) => handleChange("description", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="icon">Icon</Label>
          <Input
            id="icon"
            value={values.icon}
            onChange={(event) => handleChange("icon", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="sortOrder">Sort Order</Label>
          <Input
            id="sortOrder"
            type="number"
            value={values.sortOrder}
            onChange={(event) => handleChange("sortOrder", Number(event.target.value))}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seoTitle">SEO Title</Label>
          <Input
            id="seoTitle"
            value={values.seoTitle}
            onChange={(event) => handleChange("seoTitle", event.target.value)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="seoDescription">SEO Description</Label>
          <Input
            id="seoDescription"
            value={values.seoDescription}
            onChange={(event) => handleChange("seoDescription", event.target.value)}
          />
        </div>

        <ImageUploadInput
          id="image"
          label="Image"
          value={values.image}
          onChange={(url) => handleChange("image", url)}
          folder="categories"
        />

        <div className="flex items-center gap-3">
          <Switch
            id="published"
            checked={values.published}
            onCheckedChange={(checked) => handleChange("published", checked)}
          />
          <Label htmlFor="published">Published</Label>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Category"}
        </Button>
      </div>
    </form>
  );
}
