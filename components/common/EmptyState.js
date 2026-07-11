import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({ message = "Belum ada data.", actionLabel, actionHref }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-muted/30 p-10 text-center">
      <PackageSearch className="size-8 text-muted-foreground/60" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
      {actionLabel && actionHref ? (
        <Button size="sm" variant="outline" render={<Link href={actionHref} />} nativeButton={false}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
