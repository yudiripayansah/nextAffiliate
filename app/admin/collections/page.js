import { getCollections } from "@/services/collection/collection.service";
import CollectionsManager from "@/components/collection/CollectionsManager";

export const metadata = {
  title: "Collections",
  robots: { index: false, follow: false },
};

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return <CollectionsManager collections={collections} />;
}
