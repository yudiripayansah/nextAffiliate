"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBox({ className }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  function handleSubmit(event) {
    event.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className={className} role="search">
      <div className="flex items-center overflow-hidden rounded-full border-2 border-primary/15 bg-card shadow-sm transition-colors focus-within:border-primary/40 dark:border-border">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Cari produk impianmu..."
          aria-label="Cari produk"
          className="h-11 w-full min-w-0 bg-transparent px-5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Cari"
          className="mr-1.5 flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Search className="size-4" />
          <span className="hidden sm:inline">Cari</span>
        </button>
      </div>
    </form>
  );
}
