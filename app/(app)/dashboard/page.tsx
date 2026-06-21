import Link from "next/link";
import { BarChart3, CheckCircle2, Menu, MousePointerClick, Save, Search } from "lucide-react";
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
      <div className="flex items-center gap-2">
        <button className="grid h-11 w-11 place-items-center rounded-md border border-neutral-800 bg-[#050505] text-neutral-300">
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-neutral-600" />
          <input
            className="h-11 w-full rounded-md border border-neutral-800 bg-[#050505] pl-11 pr-4 text-sm text-neutral-300 placeholder:text-neutral-600 focus-ring"
            placeholder="Search products, drafts, or shop links"
          />
        </div>
        <Link href="/settings" className="rounded-md border border-neutral-800 bg-[#050505] px-4 py-2.5 text-sm font-semibold text-neutral-100">
          Settings
        </Link>
      </div>

      <section className="rounded-lg border border-neutral-800 bg-[#050505] p-6">
        <div className="mb-6 flex items-start justify-between gap-4 border-b border-neutral-900 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500">
              <CheckCircle2 className="h-4 w-4 text-blue-500" />
              Production workflow
            </div>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-100">
              Import listings and generate ready-to-review posts
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-neutral-500">
              Paste a shop link, choose a product, generate AI copy, then prepare a draft for your connected social account.
            </p>
          </div>
          <div className="hidden rounded-full border border-neutral-800 px-3 py-1 text-xs font-medium text-neutral-500 md:block">
            Local first
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div>
            <EtsyImportForm label={hasImportedProducts ? "Refresh listings" : "Import listings"} />
          </div>
          <div className="rounded-lg border border-neutral-900 bg-black p-4">
            <h3 className="text-sm font-semibold text-neutral-200">Workflow</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Step done={hasImportedProducts} label="Import shop listings" />
              <Step done={false} label="Select one product" />
              <Step done={false} label="Generate AI content" />
              <Step done={false} label="Save or publish draft" />
            </div>
          </div>
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
            <p className="text-sm font-medium text-neutral-500">Analytics locked</p>
            <p className="mt-2 text-sm leading-6 text-neutral-300">Connect your account in Settings to show real performance data.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className={done ? "h-4 w-4 text-blue-500" : "h-4 w-4 text-neutral-700"} />
      <span className={done ? "font-medium text-neutral-200" : "text-neutral-500"}>{label}</span>
    </div>
  );
}
