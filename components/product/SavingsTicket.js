import { formatPrice } from "@/utils/formatPrice";

export default function SavingsTicket({ amount }) {
  if (!amount || amount <= 0) return null;

  return (
    <div
      className="absolute inset-x-0 bottom-0 flex items-baseline gap-1.5 border-t-2 border-dashed border-primary-foreground/40 bg-primary px-2.5 py-1.5 text-primary-foreground"
      role="note"
    >
      <span className="font-display text-[10px] font-medium uppercase tracking-wider opacity-90">Hemat</span>
      <span className="font-price text-sm font-bold leading-none">{formatPrice(amount)}</span>
    </div>
  );
}
