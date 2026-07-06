import CategoryForm from "@/components/category/CategoryForm";

export const metadata = {
  title: "Tambah Category",
  robots: { index: false, follow: false },
};

export default function NewCategoryPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Tambah Category</h1>
      <CategoryForm />
    </div>
  );
}
