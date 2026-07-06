import { notFound } from "next/navigation";
import { getCategory } from "@/services/category/category.service";
import CategoryForm from "@/components/category/CategoryForm";

export const metadata = {
  title: "Edit Category",
  robots: { index: false, follow: false },
};

export default async function EditCategoryPage({ params }) {
  const { id } = await params;
  const category = await getCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Edit Category</h1>
      <CategoryForm initialCategory={category} />
    </div>
  );
}
