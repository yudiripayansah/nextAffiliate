"use client";

import { useState } from "react";
import { Menu, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminMobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Buka menu" className="lg:hidden" />}
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-64 bg-sidebar p-4 text-sidebar-foreground [&_[data-slot=sheet-close]]:text-sidebar-foreground"
      >
        <SheetHeader className="p-0">
          <SheetTitle className="flex items-center gap-2.5 text-sidebar-foreground">
            <span className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Tag className="size-4" aria-hidden="true" />
            </span>
            Back Office
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4">
          <AdminNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
