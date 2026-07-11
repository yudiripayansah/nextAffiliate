import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layers,
  FolderOpen,
  BarChart3,
  Settings,
} from "lucide-react";

export const ADMIN_NAV_SECTIONS = [
  {
    label: null,
    items: [{ label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Katalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: FolderTree },
      { label: "Collections", href: "/admin/collections", icon: Layers },
    ],
  },
  {
    label: "Media",
    items: [{ label: "File Manager", href: "/admin/files", icon: FolderOpen }],
  },
  {
    label: "Insight",
    items: [{ label: "Analytics", href: "/admin/analytics", icon: BarChart3 }],
  },
  {
    label: "Sistem",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export const ADMIN_NAV_ITEMS = ADMIN_NAV_SECTIONS.flatMap((section) => section.items);
