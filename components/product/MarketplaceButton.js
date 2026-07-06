import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_LABELS } from "@/constants/marketplace";

export default function MarketplaceButton({ slug, marketplace }) {
  return (
    <Button asChild size="lg" className="w-full">
      <Link href={`/go/${slug}`}>Beli di {MARKETPLACE_LABELS[marketplace] ?? marketplace}</Link>
    </Button>
  );
}
