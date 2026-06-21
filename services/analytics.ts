import { demoAnalytics, demoPinDrafts, demoProducts } from "@/lib/demo-data";
import { getEtsyListings } from "@/services/etsy";

export async function getAnalyticsSummary() {
  const importedProducts = await getEtsyListings();
  const products = importedProducts.length ? importedProducts : demoProducts;
  const impressions = demoAnalytics.reduce((sum, row) => sum + row.impressions, 0);
  const outboundClicks = demoAnalytics.reduce((sum, row) => sum + row.outboundClicks, 0);
  const saves = demoAnalytics.reduce((sum, row) => sum + row.saves, 0);
  const ctr = impressions ? (outboundClicks / impressions) * 100 : 0;

  return {
    totalProducts: products.length,
    generatedPins: demoPinDrafts.length,
    scheduledPins: demoPinDrafts.filter((pin) => pin.status === "scheduled").length,
    impressions,
    outboundClicks,
    saves,
    ctr,
    bestPerformingProducts: products
      .map((product) => {
        const productStats = demoAnalytics.filter((row) => row.productId === product.id);
        const productImpressions = productStats.reduce((sum, row) => sum + row.impressions, 0);
        return { product, impressions: productImpressions };
      })
      .sort((a, b) => b.impressions - a.impressions),
    recentPinDrafts: demoPinDrafts.slice(0, 4),
    snapshots: demoAnalytics
  };
}
