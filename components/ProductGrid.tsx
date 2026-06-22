"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { ProductGridSizeControl, useProductGridSize } from "@/components/ProductGridSizeControl";
import { getLastImportedListingIds, getStoredEtsyListings } from "@/lib/client-storage";
import type { EtsyListingView } from "@/types";

export function ProductGrid({ products: initialProducts }: { products: EtsyListingView[] }) {
  const [storedProducts, setStoredProducts] = useState<EtsyListingView[]>([]);
  const [lastImportedIds, setLastImportedIds] = useState<string[]>([]);
  const gridSize = useProductGridSize();

  useEffect(() => {
    setStoredProducts(getStoredEtsyListings());
    setLastImportedIds(getLastImportedListingIds());
  }, []);

  const products = useMemo(
    () => (storedProducts.length ? storedProducts : initialProducts),
    [storedProducts, initialProducts]
  );

  if (!products.length) {
    return (
      <EmptyState
        icon={PackageSearch}
        title="No products yet"
        description="Import your Etsy shop from the dashboard first."
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <ProductGridSizeControl />
      </div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(auto-fill, minmax(${gridSize}px, 1fr))` }}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isNew={lastImportedIds.includes(product.id)} />
        ))}
      </div>
    </div>
  );
}
