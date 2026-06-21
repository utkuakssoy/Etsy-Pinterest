"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Package, Sparkles } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ProductCard } from "@/components/ProductCard";
import { getStoredEtsyListings } from "@/lib/client-storage";
import { formatNumber } from "@/lib/utils";
import type { EtsyListingView } from "@/types";

function useClientProducts(initialProducts: EtsyListingView[]) {
  const [storedProducts, setStoredProducts] = useState<EtsyListingView[]>([]);

  useEffect(() => {
    setStoredProducts(getStoredEtsyListings());
  }, []);

  return useMemo(
    () => (storedProducts.length ? storedProducts : initialProducts),
    [storedProducts, initialProducts]
  );
}

export function DashboardProducts({ initialProducts }: { initialProducts: EtsyListingView[] }) {
  const products = useClientProducts(initialProducts);
  const firstProduct = products[0];

  if (!products.length) {
    return null;
  }

  return (
    <section className="rounded-lg border border-neutral-800 bg-[#050505] p-4">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-xs font-medium text-neutral-500">Next step</p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-neutral-100">Choose a product</h2>
          <p className="mt-1 text-xs text-neutral-500">{products.length} products are ready.</p>
        </div>
        {firstProduct && (
          <Link
            href={`/generate?product=${firstProduct.id}`}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-black"
          >
            <Sparkles className="h-4 w-4" />
            Continue with first product
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.slice(0, 10).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export function DashboardProductCount({ initialProducts }: { initialProducts: EtsyListingView[] }) {
  const products = useClientProducts(initialProducts);

  return <DashboardCard title="Products" value={formatNumber(products.length)} icon={Package} />;
}
