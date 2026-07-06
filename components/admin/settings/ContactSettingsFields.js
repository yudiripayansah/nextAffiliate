import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SOCIAL_FIELDS = [
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
  { key: "youtube", label: "YouTube" },
  { key: "telegram", label: "Telegram" },
];

export default function ContactSettingsFields({ values, onChangeSocial, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="contactEmail">Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={values.contactEmail}
          onChange={(event) => onChange("contactEmail", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contactWhatsapp">WhatsApp</Label>
        <Input
          id="contactWhatsapp"
          value={values.contactWhatsapp}
          onChange={(event) => onChange("contactWhatsapp", event.target.value)}
        />
      </div>

      {SOCIAL_FIELDS.map(({ key, label }) => (
        <div key={key} className="flex flex-col gap-2">
          <Label htmlFor={key}>{label}</Label>
          <Input
            id={key}
            value={values.socialLinks?.[key] ?? ""}
            onChange={(event) => onChangeSocial(key, event.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
