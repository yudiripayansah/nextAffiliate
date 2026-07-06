import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductPricingFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          min={0}
          value={values.price}
          onChange={(event) => onChange("price", event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="originalPrice">Original Price</Label>
        <Input
          id="originalPrice"
          type="number"
          min={0}
          value={values.originalPrice}
          onChange={(event) => onChange("originalPrice", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="rating">Rating</Label>
        <Input
          id="rating"
          type="number"
          min={0}
          max={5}
          step="0.1"
          value={values.rating}
          onChange={(event) => onChange("rating", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="sold">Sold</Label>
        <Input
          id="sold"
          type="number"
          min={0}
          value={values.sold}
          onChange={(event) => onChange("sold", event.target.value)}
        />
      </div>
    </div>
  );
}
