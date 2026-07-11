import { cn } from "@/lib/utils";

const TOP_RANK_CLASSES = {
  1: "bg-primary text-primary-foreground",
  2: "bg-primary/15 text-primary",
  3: "bg-primary/10 text-primary/80",
};

export default function RankBadge({ rank }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center rounded-full font-price text-xs font-bold",
        TOP_RANK_CLASSES[rank] ?? "bg-muted text-muted-foreground"
      )}
    >
      {rank}
    </span>
  );
}
