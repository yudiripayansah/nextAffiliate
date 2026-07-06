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

const EMPTY_COLLECTION = {
  name: "",
  slug: "",
  description: "",
  image: "",
  seoTitle: "",
  seoDescription: "",
  featured: false,
  published: false,
};

export default function CollectionForm({ initialCollection, onSuccess }) {
  const router = useRouter();
  const [values, setValues] = useState({ ...EMPTY_COLLECTION, ...initialCollection });
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

    const isEdit = Boolean(initialCollection?.id);
    const url = isEdit ? `/api/collections/${initialCollection.id}` : "/api/collections";
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

    setIsSubmitting(false);
    router.refresh();
    onSuccess?.();
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
          label="Banner"
          value={values.image}
          onChange={(url) => handleChange("image", url)}
          folder="collections"
        />

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Switch
              id="featured"
              checked={values.featured}
              onCheckedChange={(checked) => handleChange("featured", checked)}
            />
            <Label htmlFor="featured">Featured</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="published"
              checked={values.published}
              onCheckedChange={(checked) => handleChange("published", checked)}
            />
            <Label htmlFor="published">Published</Label>
          </div>
        </div>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Collection"}
        </Button>
      </div>
    </form>
  );
}
