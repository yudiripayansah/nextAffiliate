"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PAGE_SIZES = [20, 50, 100];

export default function PageSizeSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLimit = searchParams.get("limit") ?? "20";

  function handleChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", value);
    params.delete("after");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select value={currentLimit} onValueChange={handleChange}>
      <SelectTrigger className="w-24">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZES.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
