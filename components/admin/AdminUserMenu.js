"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutClient } from "@/services/auth/authClient";

export default function AdminUserMenu({ email }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const initial = (email || "?").charAt(0).toUpperCase();

  async function handleLogout() {
    setIsSubmitting(true);
    await fetch("/api/logout", { method: "POST" });
    await signOutClient();
    router.push("/login");
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Menu akun"
        className="flex size-8 items-center justify-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground outline-none transition-transform hover:scale-105 focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        {initial}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        <DropdownMenuLabel className="truncate">{email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<a href="/" target="_blank" rel="noreferrer" />}
        >
          <ExternalLink aria-hidden="true" />
          Lihat Situs
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" disabled={isSubmitting} onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          {isSubmitting ? "Keluar..." : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
