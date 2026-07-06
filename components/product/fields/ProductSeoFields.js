import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductSeoFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input
          id="seoTitle"
          value={values.seoTitle}
          onChange={(event) => onChange("seoTitle", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="seoDescription">SEO Description</Label>
        <Input
          id="seoDescription"
          value={values.seoDescription}
          onChange={(event) => onChange("seoDescription", event.target.value)}
        />
      </div>
    </div>
  );
}
