import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKETPLACES } from "@/constants/marketplace";

export default function ProductMarketplaceFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="marketplace">Marketplace</Label>
        <Select value={values.marketplace} onValueChange={(value) => onChange("marketplace", value)}>
          <SelectTrigger id="marketplace">
            <SelectValue placeholder="Pilih marketplace" />
          </SelectTrigger>
          <SelectContent>
            {MARKETPLACES.map(({ value, label }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="brand">Brand</Label>
        <Input id="brand" value={values.brand} onChange={(event) => onChange("brand", event.target.value)} />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="affiliateUrl">Affiliate URL</Label>
        <Input
          id="affiliateUrl"
          type="url"
          value={values.affiliateUrl}
          onChange={(event) => onChange("affiliateUrl", event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="originalUrl">Original URL</Label>
        <Input
          id="originalUrl"
          type="url"
          value={values.originalUrl}
          onChange={(event) => onChange("originalUrl", event.target.value)}
          required
        />
      </div>
    </div>
  );
}
