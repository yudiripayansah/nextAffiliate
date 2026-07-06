"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

function parseAfterStack(searchParams) {
  const raw = searchParams.get("after");
  return raw ? raw.split(",").filter(Boolean) : [];
}

export default function PaginationControls({ hasMore, lastId }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const afterStack = parseAfterStack(searchParams);

  function buildUrl(nextStack) {
    const params = new URLSearchParams(searchParams.toString());
    if (nextStack.length) {
      params.set("after", nextStack.join(","));
    } else {
      params.delete("after");
    }
    return `${pathname}?${params.toString()}`;
  }

  function handlePrevious() {
    router.push(buildUrl(afterStack.slice(0, -1)));
  }

  function handleNext() {
    router.push(buildUrl([...afterStack, lastId]));
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button variant="outline" size="sm" onClick={handlePrevious} disabled={!afterStack.length}>
        Previous
      </Button>
      <Button variant="outline" size="sm" onClick={handleNext} disabled={!hasMore}>
        Next
      </Button>
    </div>
  );
}
