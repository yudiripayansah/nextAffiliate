import { getSettings } from "@/services/settings/settings.service";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export const metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Settings" description="Konfigurasi situs, SEO, dan affiliate." />
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
