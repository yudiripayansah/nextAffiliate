import { getFiles } from "@/services/file/file.service";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import FileManager from "@/components/file/FileManager";

export const metadata = {
  title: "File Manager",
  robots: { index: false, follow: false },
};

export default async function AdminFilesPage() {
  const files = await getFiles();

  return (
    <div className="flex flex-col gap-4">
      <AdminPageHeader title="File Manager" description="Kelola gambar dan file yang diupload." />
      <FileManager initialFiles={files} />
    </div>
  );
}
