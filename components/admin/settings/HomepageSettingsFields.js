import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HomepageSettingsFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="heroTitle">Hero Title</Label>
        <Input
          id="heroTitle"
          value={values.heroTitle}
          onChange={(event) => onChange("heroTitle", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
        <Input
          id="heroSubtitle"
          value={values.heroSubtitle}
          onChange={(event) => onChange("heroSubtitle", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="heroBanner">Hero Banner URL</Label>
        <Input
          id="heroBanner"
          value={values.heroBanner}
          onChange={(event) => onChange("heroBanner", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="featuredProductsLimit">Featured Products Limit</Label>
        <Input
          id="featuredProductsLimit"
          type="number"
          min={1}
          value={values.featuredProductsLimit}
          onChange={(event) => onChange("featuredProductsLimit", Number(event.target.value))}
        />
      </div>
    </div>
  );
}
