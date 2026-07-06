import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKETPLACES } from "@/constants/marketplace";

export default function AffiliateSettingsFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="defaultMarketplace">Default Marketplace</Label>
        <Select
          value={values.defaultMarketplace}
          onValueChange={(value) => onChange("defaultMarketplace", value)}
        >
          <SelectTrigger id="defaultMarketplace">
            <SelectValue />
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
        <Label htmlFor="redirectDelay">Redirect Delay (ms)</Label>
        <Input
          id="redirectDelay"
          type="number"
          min={0}
          value={values.redirectDelay}
          onChange={(event) => onChange("redirectDelay", Number(event.target.value))}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="openInNewTab"
          checked={values.openInNewTab}
          onCheckedChange={(checked) => onChange("openInNewTab", checked)}
        />
        <Label htmlFor="openInNewTab">Buka link di tab baru</Label>
      </div>

      <div className="flex items-center gap-3">
        <Switch
          id="trackingEnabled"
          checked={values.trackingEnabled}
          onCheckedChange={(checked) => onChange("trackingEnabled", checked)}
        />
        <Label htmlFor="trackingEnabled">Aktifkan click tracking</Label>
      </div>
    </div>
  );
}
