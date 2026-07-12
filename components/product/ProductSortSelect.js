"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SORT_OPTIONS = [
  { value: "created", label: "Terbaru" },
  { value: "price_asc", label: "Harga Terendah" },
  { value: "price_desc", label: "Harga Tertinggi" },
  { value: "rating", label: "Rating Terbaik" },
  { value: "click", label: "Paling Populer" },
];

export default function ProductSortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    params.delete("after");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select value={searchParams.get("sort") ?? "created"} onValueChange={handleChange}>
      <SelectTrigger className="w-44 rounded-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {SORT_OPTIONS.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
