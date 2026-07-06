"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import GeneralSettingsFields from "./GeneralSettingsFields";
import ContactSettingsFields from "./ContactSettingsFields";
import HomepageSettingsFields from "./HomepageSettingsFields";
import AffiliateSettingsFields from "./AffiliateSettingsFields";
import SeoSettingsFields from "./SeoSettingsFields";
import FooterSettingsFields from "./FooterSettingsFields";

const SECTIONS = [
  { title: "General", Component: GeneralSettingsFields },
  { title: "Contact", Component: ContactSettingsFields },
  { title: "Homepage", Component: HomepageSettingsFields },
  { title: "Affiliate", Component: AffiliateSettingsFields },
  { title: "SEO", Component: SeoSettingsFields },
  { title: "Footer", Component: FooterSettingsFields },
];

export default function SettingsForm({ initialSettings }) {
  const [values, setValues] = useState(initialSettings);
  const [status, setStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  function handleChangeSocial(key, value) {
    setValues((prev) => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [key]: value },
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const response = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = await response.json();

    setStatus({ success: result.success, message: result.message });
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {SECTIONS.map(({ title, Component }) => (
        <Card key={title}>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Component values={values} onChange={handleChange} onChangeSocial={handleChangeSocial} />
          </CardContent>
        </Card>
      ))}

      {status ? (
        <p role="alert" className={status.success ? "text-sm text-primary" : "text-sm text-destructive"}>
          {status.message}
        </p>
      ) : null}

      <div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Menyimpan..." : "Simpan Settings"}
        </Button>
      </div>
    </form>
  );
}
