import { getSettings } from "@/services/settings/settings.service";
import SettingsForm from "@/components/admin/settings/SettingsForm";

export const metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return <SettingsForm initialSettings={settings} />;
}
