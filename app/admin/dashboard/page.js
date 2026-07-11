import Link from "next/link";
import { PackageCheck, MousePointerClick, TrendingUp, FileClock } from "lucide-react";
import {
  getProductStats,
  getMarketplaceStats,
  getRecentProducts,
  getPopularProducts,
} from "@/services/product/product.service";
import { getCategoryCount } from "@/services/category/category.service";
import { getCollectionCount } from "@/services/collection/collection.service";
import { getClickStats, getRecentSearches } from "@/services/analytics/analytics.service";
import GreetingHeader from "@/components/admin/GreetingHeader";
import StatCard from "@/components/admin/StatCard";
import CatalogStatusCard from "@/components/admin/CatalogStatusCard";
import MarketplaceShareList from "@/components/admin/MarketplaceShareList";
import QuickActions from "@/components/admin/QuickActions";
import RecentProductsTable from "@/components/admin/RecentProductsTable";
import PopularProductsTable from "@/components/admin/PopularProductsTable";
import RecentSearchesTable from "@/components/admin/RecentSearchesTable";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

function CardLink({ href, children }) {
  return (
    <Link href={href} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export default async function AdminDashboardPage() {
  const [productStats, marketplaceStats, categoryCount, collectionCount, clickStats, recentProducts, popularProducts, recentSearches] =
    await Promise.all([
      getProductStats(),
      getMarketplaceStats(),
      getCategoryCount(),
      getCollectionCount(),
      getClickStats(),
      getRecentProducts(5),
      getPopularProducts(10),
      getRecentSearches(5),
    ]);

  const statCards = [
    {
      label: "Produk Live",
      value: productStats.published,
      icon: PackageCheck,
      tone: "trust",
      hint: `dari ${productStats.total} produk`,
      href: "/admin/products?status=published",
    },
    {
      label: "Klik Hari Ini",
      value: clickStats.today,
      icon: MousePointerClick,
      tone: "primary",
      hint: "menuju marketplace",
      href: "/admin/analytics",
    },
    {
      label: "Total Klik",
      value: clickStats.total,
      icon: TrendingUp,
      tone: "default",
      hint: "sepanjang waktu",
      href: "/admin/analytics",
    },
    {
      label: "Draft",
      value: productStats.draft,
      icon: FileClock,
      tone: "amber",
      hint: "menunggu dipublish",
      href: "/admin/products?status=draft",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <GreetingHeader
        description={`${productStats.published} produk live dan ${clickStats.today} klik hari ini. Lanjutkan!`}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <CatalogStatusCard
          productStats={productStats}
          categoryCount={categoryCount}
          collectionCount={collectionCount}
        />

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Marketplace</CardTitle>
            <CardDescription>Sebaran produk per marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketplaceShareList
              items={marketplaceStats.map(({ marketplace, label, total }) => ({
                marketplace,
                label,
                value: total,
              }))}
            />
          </CardContent>
        </Card>

        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Produk Terbaru</CardTitle>
            <CardDescription>5 update terakhir di katalog</CardDescription>
            <CardAction>
              <CardLink href="/admin/products">Lihat semua</CardLink>
            </CardAction>
          </CardHeader>
          <CardContent>
            <RecentProductsTable products={recentProducts} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Produk Terpopuler</CardTitle>
            <CardDescription>Paling banyak diklik</CardDescription>
            <CardAction>
              <CardLink href="/admin/analytics">Detail</CardLink>
            </CardAction>
          </CardHeader>
          <CardContent>
            <PopularProductsTable products={popularProducts} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pencarian Terbaru</CardTitle>
          <CardDescription>Apa yang dicari pengunjung</CardDescription>
          <CardAction>
            <CardLink href="/admin/analytics">Semua pencarian</CardLink>
          </CardAction>
        </CardHeader>
        <CardContent>
          <RecentSearchesTable searches={recentSearches} />
        </CardContent>
      </Card>
    </div>
  );
}
