import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function FooterSettingsFields({ values, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="footerCopyright">Copyright Text</Label>
      <Textarea
        id="footerCopyright"
        value={values.footerCopyright}
        onChange={(event) => onChange("footerCopyright", event.target.value)}
      />
    </div>
  );
}
