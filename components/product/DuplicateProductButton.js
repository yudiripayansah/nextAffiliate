"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DuplicateProductButton({ productId }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleDuplicate() {
    setIsSubmitting(true);
    await fetch(`/api/products/${productId}/duplicate`, { method: "POST" });
    setIsSubmitting(false);
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Duplicate product"
      onClick={handleDuplicate}
      disabled={isSubmitting}
    >
      <Copy className="size-4" />
    </Button>
  );
}
