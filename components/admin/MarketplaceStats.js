import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function MarketplaceStats({ stats }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map(({ marketplace, label, total }) => (
        <Card key={marketplace}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{total}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
