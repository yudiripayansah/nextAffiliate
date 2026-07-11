import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TONE_CLASSES = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  trust: "bg-trust/10 text-trust",
  amber: "bg-chart-3/15 text-chart-3",
};

export default function StatCard({ label, value, icon: Icon, hint, href, tone = "default" }) {
  const card = (
    <Card
      className={cn(
        "h-full",
        href && "transition-all hover:-translate-y-0.5 hover:ring-primary/40"
      )}
    >
      <CardContent className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="truncate text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="font-price text-3xl font-bold leading-none">{value}</span>
          {hint ? <span className="truncate text-xs text-muted-foreground">{hint}</span> : null}
        </div>
        {Icon ? (
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              TONE_CLASSES[tone] ?? TONE_CLASSES.default
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
      </CardContent>
    </Card>
  );

  if (!href) return card;

  return (
    <Link href={href} className="rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
      {card}
    </Link>
  );
}
