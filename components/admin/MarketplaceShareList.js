import { cn } from "@/lib/utils";

const MARKETPLACE_BAR_CLASSES = {
  shopee: "bg-primary",
  tokopedia: "bg-trust",
  tiktok: "bg-foreground",
};

export default function MarketplaceShareList({ items, unit = "produk" }) {
  const total = items.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="flex flex-col gap-4">
      {items.map(({ marketplace, label, value }) => {
        const share = total ? Math.round(((value || 0) / total) * 100) : 0;

        return (
          <div key={marketplace} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-medium">{label}</span>
              <span className="font-price text-muted-foreground">
                <span className="font-bold text-foreground">{value || 0}</span> {unit} · {share}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full", MARKETPLACE_BAR_CLASSES[marketplace] ?? "bg-primary")}
                style={{ width: `${share}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
