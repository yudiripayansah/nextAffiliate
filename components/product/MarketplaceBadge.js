import { Badge } from "@/components/ui/badge";
import { MARKETPLACE_LABELS } from "@/constants/marketplace";

export default function MarketplaceBadge({ marketplace }) {
  return <Badge variant="secondary">{MARKETPLACE_LABELS[marketplace] ?? marketplace}</Badge>;
}
