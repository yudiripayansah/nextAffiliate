import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MARKETPLACE_LABELS } from "@/constants/marketplace";

export default function MarketplaceButton({ slug, marketplace }) {
  const marketplaceLabel = MARKETPLACE_LABELS[marketplace] ?? marketplace;

  return (
    <div className="flex flex-col gap-2">
      <Button
        size="lg"
        className="w-full text-base font-semibold"
        render={<Link href={`/go/${slug}`} />}
        nativeButton={false}
      >
        Beli di {marketplaceLabel}
      </Button>
      <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
        <ShieldCheck className="size-3.5 text-trust" />
        Kamu akan diarahkan ke {marketplaceLabel} untuk menyelesaikan pembelian dengan aman
      </p>
    </div>
  );
}
