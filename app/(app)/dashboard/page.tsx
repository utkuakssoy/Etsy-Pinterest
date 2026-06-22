import { BarChart3, MousePointerClick, Save } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { DashboardProductCount, DashboardProducts } from "@/components/DashboardProducts";
import { EtsyImportForm } from "@/components/EtsyImportForm";
import { getAnalyticsSummary } from "@/services/analytics";
import { getEtsyListings } from "@/services/etsy";
import { formatNumber, pct } from "@/lib/utils";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: Promise<{ imported?: string }>;
}) {
  const { imported } = await searchParams;
  const [summary, products] = await Promise.all([getAnalyticsSummary(), getEtsyListings()]);
  const hasImportedProducts = Boolean(imported) || products.length > 0;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-neutral-800 bg-[#050505] p-5">
        <p className="text-sm font-medium text-neutral-500">Home</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100">
          Import products
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
          Paste an Etsy shop link or a single product link. Imported products stay in this browser.
        </p>
        <div className="mt-5">
          <EtsyImportForm label={hasImportedProducts ? "Refresh" : "Import"} />
        </div>
      </section>

      <DashboardProducts initialProducts={products} />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardProductCount initialProducts={products} />
        {summary.connected ? (
          <>
            <DashboardCard title="Impressions" value={formatNumber(summary.impressions)} icon={BarChart3} />
            <DashboardCard title="Clicks" value={formatNumber(summary.outboundClicks)} icon={MousePointerClick} />
            <DashboardCard title="CTR" value={pct(summary.ctr)} icon={Save} />
          </>
        ) : (
          <div className="rounded-lg border border-neutral-900 bg-[#050505] p-5 shadow-sm sm:col-span-1 xl:col-span-3">
            <p className="text-sm font-medium text-neutral-500">Analytics</p>
            <p className="mt-2 text-sm leading-6 text-neutral-400">Connect an account in Settings to show performance data.</p>
          </div>
        )}
      </section>
    </div>
  );
}
