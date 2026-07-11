import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadInput from "@/components/common/ImageUploadInput";

export default function SeoSettingsFields({ values, onChange }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="seoTitle">SEO Title</Label>
        <Input
          id="seoTitle"
          value={values.seoTitle}
          onChange={(event) => onChange("seoTitle", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="seoDescription">Meta Description</Label>
        <Textarea
          id="seoDescription"
          value={values.seoDescription}
          onChange={(event) => onChange("seoDescription", event.target.value)}
        />
      </div>

      <ImageUploadInput
        id="ogImage"
        label="Default OG Image"
        value={values.ogImage}
        onChange={(url) => onChange("ogImage", url)}
      />

      <div className="flex flex-col gap-2">
        <Label htmlFor="canonicalDomain">Canonical Domain</Label>
        <Input
          id="canonicalDomain"
          value={values.canonicalDomain}
          onChange={(event) => onChange("canonicalDomain", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
        <Input
          id="googleAnalyticsId"
          value={values.googleAnalyticsId}
          onChange={(event) => onChange("googleAnalyticsId", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="searchConsoleVerification">Search Console Verification</Label>
        <Input
          id="searchConsoleVerification"
          value={values.searchConsoleVerification}
          onChange={(event) => onChange("searchConsoleVerification", event.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="clarityId">Microsoft Clarity ID</Label>
        <Input
          id="clarityId"
          value={values.clarityId}
          onChange={(event) => onChange("clarityId", event.target.value)}
        />
      </div>
    </div>
  );
}
