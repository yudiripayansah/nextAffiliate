"use client";

import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/constants/adminNav";

export default function AdminPageTitle() {
  const pathname = usePathname();
  const current = ADMIN_NAV_ITEMS.find((item) => pathname.startsWith(item.href));

  if (!current) return null;

  return (
    <h1 className="font-display text-base font-bold leading-none">{current.label}</h1>
  );
}
