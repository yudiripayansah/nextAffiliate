import { Badge } from "@/components/ui/badge";
import { PRODUCT_STATUS } from "@/constants/product";

const STATUS_LABELS = {
  [PRODUCT_STATUS.DRAFT]: "Draft",
  [PRODUCT_STATUS.PUBLISHED]: "Published",
  [PRODUCT_STATUS.ARCHIVED]: "Archived",
};

const STATUS_VARIANTS = {
  [PRODUCT_STATUS.DRAFT]: "outline",
  [PRODUCT_STATUS.PUBLISHED]: "default",
  [PRODUCT_STATUS.ARCHIVED]: "secondary",
};

export default function ProductStatusBadge({ status }) {
  return (
    <Badge variant={STATUS_VARIANTS[status] ?? "outline"}>
      {STATUS_LABELS[status] ?? status}
    </Badge>
  );
}
