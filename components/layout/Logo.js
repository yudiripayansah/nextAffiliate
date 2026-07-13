import { cn } from "@/lib/utils";

export default function Logo({ siteName, className, markClassName }) {
  return (
    <span className={cn("flex items-center gap-1.5", className)}>
      <span aria-hidden="true" className={markClassName}>✦</span>
      <span className="font-display font-bold">{siteName}</span>
    </span>
  );
}
