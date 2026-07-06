"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKETPLACES } from "@/constants/marketplace";
import { PRODUCT_STATUS } from "@/constants/product";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Best Rating" },
  { value: "click", label: "Most Clicked" },
];

const ALL_VALUE = "all";

export default function ProductFiltersBar({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === ALL_VALUE) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("after");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Select value={searchParams.get("marketplace") ?? ALL_VALUE} onValueChange={(value) => updateParam("marketplace", value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Marketplace" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Semua Marketplace</SelectItem>
          {MARKETPLACES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={searchParams.get("categoryId") ?? ALL_VALUE} onValueChange={(value) => updateParam("categoryId", value)}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Semua Category</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={searchParams.get("status") ?? ALL_VALUE} onValueChange={(value) => updateParam("status", value)}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>Semua Status</SelectItem>
          <SelectItem value={PRODUCT_STATUS.DRAFT}>Draft</SelectItem>
          <SelectItem value={PRODUCT_STATUS.PUBLISHED}>Published</SelectItem>
          <SelectItem value={PRODUCT_STATUS.ARCHIVED}>Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select value={searchParams.get("sort") ?? "newest"} onValueChange={(value) => updateParam("sort", value)}>
        <SelectTrigger className="w-44">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
