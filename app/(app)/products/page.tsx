import { ProductGrid } from "@/components/ProductGrid";
import { getEtsyListings } from "@/services/etsy";

export default async function ProductsPage() {
  const products = await getEtsyListings();

  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-neutral-500">Etsy kataloğu</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">Ürünler</h1>
        </div>
        <a className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm" href="/connect/etsy">
          Etsy linki gir
        </a>
      </header>
      <ProductGrid products={products} />
    </div>
  );
}
