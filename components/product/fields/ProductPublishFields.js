import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ProductPublishFields({ values, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Switch
          id="featured"
          checked={values.featured}
          onCheckedChange={(checked) => onChange("featured", checked)}
        />
        <Label htmlFor="featured">Featured</Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="published"
          checked={values.published}
          onCheckedChange={(checked) => onChange("published", checked)}
        />
        <Label htmlFor="published">Published</Label>
      </div>
    </div>
  );
}
