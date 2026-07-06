import {
  getRangeSummary,
  getTopProductsByClicks,
  getMarketplaceClickStats,
  getCategoryAnalytics,
  getCollectionAnalytics,
  getSearchAnalytics,
} from "@/services/analytics/analyticsDashboard.service";
import StatCard from "@/components/admin/StatCard";
import RangeSelect from "@/components/admin/analytics/RangeSelect";
import TopProductsTable from "@/components/admin/analytics/TopProductsTable";
import MarketplaceAnalytics from "@/components/admin/analytics/MarketplaceAnalytics";
import EntityAnalyticsTable from "@/components/admin/analytics/EntityAnalyticsTable";
import RecentSearchesTable from "@/components/admin/RecentSearchesTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Analytics</h1>
        <RangeSelect />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCard label="Total Click" value={summary.totalClicks} />
        <StatCard label="Total Search" value={summary.totalSearches} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <TopProductsTable products={topProducts} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Marketplace Analytics</h2>
        <MarketplaceAnalytics stats={marketplaceStats} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <EntityAnalyticsTable entityLabel="Category" items={categoryAnalytics} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collection Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <EntityAnalyticsTable entityLabel="Collection" items={collectionAnalytics} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Search Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentSearchesTable searches={searches} />
        </CardContent>
      </Card>
    </div>
  );
}
