import Link from "next/link";
import { ArrowRight, BarChart3, CheckCircle2, MousePointerClick, Package, Save, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ProductCard } from "@/components/ProductCard";
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
  const firstProduct = products[0];

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-neutral-500">PinPilot</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Etsy ürününden Pinterest pini oluştur</h1>
      </header>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-950 text-xs text-white">1</span>
              İlk adım
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight">
              Etsy mağazanı içeri al
            </h2>
            <p className="mt-2 max-w-2xl text-base leading-7 text-neutral-600">
              Sadece mağaza linkini yapıştır. Ürünler gelince bir ürün seçip tek tuşla Pinterest SEO ve pin taslağı oluşturacaksın.
            </p>
            <div className="mt-5">
              <EtsyImportForm label={imported || products.length ? "Ürünleri yenile" : "Ürünleri getir"} />
            </div>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="font-semibold">Ne yapacağım?</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Step done={products.length > 0} label="Etsy mağaza linkini yapıştır" />
              <Step done={false} label="Bir ürün seç" />
              <Step done={false} label="SEO oluştur" />
              <Step done={false} label="Pin taslağını kaydet" />
            </div>
          </div>
        </div>
      </section>

      {products.length > 0 && (
        <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm font-semibold text-neutral-700">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-neutral-950 text-xs text-white">2</span>
                Sıradaki adım
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight">Bir ürün seç ve SEO oluştur</h2>
              <p className="mt-2 text-base text-neutral-600">{products.length} ürün hazır.</p>
            </div>
            {firstProduct && (
              <Link
                href={`/generate?product=${firstProduct.id}`}
                className="inline-flex items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-base font-semibold text-white shadow-sm"
              >
                <Sparkles className="h-5 w-5" />
                İlk ürünle devam et
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Ürün" value={formatNumber(summary.totalProducts)} icon={Package} />
        <DashboardCard title="Gösterim" value={formatNumber(summary.impressions)} icon={BarChart3} />
        <DashboardCard title="Tıklama" value={formatNumber(summary.outboundClicks)} icon={MousePointerClick} />
        <DashboardCard title="CTR" value={pct(summary.ctr)} icon={Save} />
      </section>
    </div>
  );
}

function Step({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <CheckCircle2 className={done ? "h-5 w-5 text-emerald-600" : "h-5 w-5 text-neutral-300"} />
      <span className={done ? "font-medium text-neutral-950" : "text-neutral-500"}>{label}</span>
    </div>
  );
}
