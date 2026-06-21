import { BarChart3, MousePointerClick, Save } from "lucide-react";
import { AnalyticsCard } from "@/components/AnalyticsCard";
import { getAnalyticsSummary } from "@/services/analytics";
import { formatNumber, pct } from "@/lib/utils";

export default async function AnalyticsPage() {
  const summary = await getAnalyticsSummary();

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-neutral-500">Performans</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Sonuçlar</h1>
      </header>
      <section className="grid gap-4 md:grid-cols-4">
        <AnalyticsCard title="Impressions" value={formatNumber(summary.impressions)} icon={BarChart3} />
        <AnalyticsCard title="Clicks" value={formatNumber(summary.outboundClicks)} icon={MousePointerClick} />
        <AnalyticsCard title="Saves" value={formatNumber(summary.saves)} icon={Save} />
        <AnalyticsCard title="CTR" value={pct(summary.ctr)} icon={BarChart3} />
      </section>
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Impressions</th>
              <th className="px-4 py-3 font-medium">Clicks</th>
              <th className="px-4 py-3 font-medium">Saves</th>
              <th className="px-4 py-3 font-medium">CTR</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {summary.snapshots.map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-4">{row.date}</td>
                <td className="px-4 py-4">{formatNumber(row.impressions)}</td>
                <td className="px-4 py-4">{formatNumber(row.outboundClicks)}</td>
                <td className="px-4 py-4">{formatNumber(row.saves)}</td>
                <td className="px-4 py-4">{pct(row.ctr)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
