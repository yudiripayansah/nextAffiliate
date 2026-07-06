import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProductCategoryFields({ values, onChange, categories, collections }) {
  function toggleCollection(collectionId, checked) {
    const next = checked
      ? [...values.collectionIds, collectionId]
      : values.collectionIds.filter((id) => id !== collectionId);
    onChange("collectionIds", next);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="categoryId">Category</Label>
        <Select value={values.categoryId} onValueChange={(value) => onChange("categoryId", value)}>
          <SelectTrigger id="categoryId">
            <SelectValue placeholder="Pilih category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label>Collections</Label>
        <div className="flex flex-col gap-2 rounded-md border p-3">
          {collections.length ? (
            collections.map((collection) => (
              <label key={collection.id} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={values.collectionIds.includes(collection.id)}
                  onCheckedChange={(checked) => toggleCollection(collection.id, checked)}
                />
                {collection.name}
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada collection.</p>
          )}
        </div>
      </div>
    </div>
  );
}
