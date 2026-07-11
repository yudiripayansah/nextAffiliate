"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_SECTIONS } from "@/constants/adminNav";
import { cn } from "@/lib/utils";

export default function AdminNav({ onNavigate }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-5">
      {ADMIN_NAV_SECTIONS.map((section) => (
        <div key={section.label ?? "root"} className="flex flex-col gap-1">
          {section.label ? (
            <span className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/45">
              {section.label}
            </span>
          ) : null}

          {section.items.map(({ label, href, icon: Icon }) => {
            const isActive = pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                onClick={onNavigate}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-4 transition-transform group-hover:scale-110",
                    isActive ? "" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                  )}
                  aria-hidden="true"
                />
                {label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
