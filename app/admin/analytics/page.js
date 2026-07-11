import { MousePointerClick, Search } from "lucide-react";
import {
  getRangeSummary,
  getTopProductsByClicks,
  getMarketplaceClickStats,
  getCategoryAnalytics,
  getCollectionAnalytics,
  getSearchAnalytics,
} from "@/services/analytics/analyticsDashboard.service";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import StatCard from "@/components/admin/StatCard";
import MarketplaceShareList from "@/components/admin/MarketplaceShareList";
import RangeSelect from "@/components/admin/analytics/RangeSelect";
import TopProductsTable from "@/components/admin/analytics/TopProductsTable";
import EntityAnalyticsTable from "@/components/admin/analytics/EntityAnalyticsTable";
import RecentSearchesTable from "@/components/admin/RecentSearchesTable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Analytics",
  robots: { index: false, follow: false },
};

export default async function AdminAnalyticsPage({ searchParams }) {
  const { range: rawRange } = await searchParams;
  const range = rawRange || "today";

  const [summary, topProducts, marketplaceStats, categoryAnalytics, collectionAnalytics, searches] =
    await Promise.all([
      getRangeSummary(range),
      getTopProductsByClicks({ range, limitCount: 10 }),
      getMarketplaceClickStats({ range }),
      getCategoryAnalytics(),
      getCollectionAnalytics(),
      getSearchAnalytics({ range, limitCount: 20 }),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader title="Analytics" description="Performa klik dan pencarian pengunjung.">
        <RangeSelect />
      </AdminPageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard
          label="Total Klik"
          value={summary.totalClicks}
          icon={MousePointerClick}
          tone="primary"
          hint="klik menuju marketplace"
        />
        <StatCard
          label="Total Pencarian"
          value={summary.totalSearches}
          icon={Search}
          tone="trust"
          hint="kata kunci dari pengunjung"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Produk Teratas</CardTitle>
            <CardDescription>Berdasarkan klik pada rentang terpilih</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProductsTable products={topProducts} />
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle>Marketplace</CardTitle>
            <CardDescription>Sebaran klik per marketplace</CardDescription>
          </CardHeader>
          <CardContent>
            <MarketplaceShareList
              unit="klik"
              items={marketplaceStats.map(({ marketplace, label, totalClicks }) => ({
                marketplace,
                label,
                value: totalClicks,
              }))}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Kategori</CardTitle>
            <CardDescription>Produk dan klik per kategori</CardDescription>
          </CardHeader>
          <CardContent>
            <EntityAnalyticsTable entityLabel="Category" items={categoryAnalytics} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection</CardTitle>
            <CardDescription>Produk dan klik per collection</CardDescription>
          </CardHeader>
          <CardContent>
            <EntityAnalyticsTable entityLabel="Collection" items={collectionAnalytics} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pencarian</CardTitle>
          <CardDescription>Kata kunci pada rentang terpilih</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentSearchesTable searches={searches} />
        </CardContent>
      </Card>
    </div>
  );
}
