import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageUploadInput from "@/components/common/ImageUploadInput";

export default function GeneralSettingsFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="siteName">Site Name</Label>
        <Input
          id="siteName"
          value={values.siteName}
          onChange={(event) => onChange("siteName", event.target.value)}
          required
        />
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="siteDescription">Site Description</Label>
        <Textarea
          id="siteDescription"
          value={values.siteDescription}
          onChange={(event) => onChange("siteDescription", event.target.value)}
        />
      </div>

      <ImageUploadInput
        id="logo"
        label="Logo"
        value={values.logo}
        onChange={(url) => onChange("logo", url)}
      />

      <ImageUploadInput
        id="favicon"
        label="Favicon"
        value={values.favicon}
        onChange={(url) => onChange("favicon", url)}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="theme">Theme</Label>
        <Select value={values.theme} onValueChange={(value) => onChange("theme", value)}>
          <SelectTrigger id="theme">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
