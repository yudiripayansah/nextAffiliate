import {
  getProductStats,
  getMarketplaceStats,
  getRecentProducts,
  getPopularProducts,
} from "@/services/product/product.service";
import { getCategoryCount } from "@/services/category/category.service";
import { getCollectionCount } from "@/services/collection/collection.service";
import { getClickStats, getRecentSearches } from "@/services/analytics/analytics.service";
import StatCard from "@/components/admin/StatCard";
import MarketplaceStats from "@/components/admin/MarketplaceStats";
import RecentProductsTable from "@/components/admin/RecentProductsTable";
import PopularProductsTable from "@/components/admin/PopularProductsTable";
import RecentSearchesTable from "@/components/admin/RecentSearchesTable";
import QuickActions from "@/components/admin/QuickActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

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
    { label: "Total Products", value: productStats.total },
    { label: "Published Products", value: productStats.published },
    { label: "Draft Products", value: productStats.draft },
    { label: "Archived Products", value: productStats.archived },
    { label: "Categories", value: categoryCount },
    { label: "Collections", value: collectionCount },
    { label: "Today's Click", value: clickStats.today },
    { label: "Total Click", value: clickStats.total },
  ];

  return (
    <div className="flex flex-col gap-6">
      <QuickActions />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Products</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentProductsTable products={recentProducts} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Products</CardTitle>
        </CardHeader>
        <CardContent>
          <PopularProductsTable products={popularProducts} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Marketplace Statistics</h2>
        <MarketplaceStats stats={marketplaceStats} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Searches</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentSearchesTable searches={recentSearches} />
        </CardContent>
      </Card>
    </div>
  );
}
