"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import { getStoredEtsyListings } from "@/lib/client-storage";
import type { EtsyListingView } from "@/types";

export function ProductGrid({ products: initialProducts }: { products: EtsyListingView[] }) {
  const [storedProducts, setStoredProducts] = useState<EtsyListingView[]>([]);

  useEffect(() => {
    setStoredProducts(getStoredEtsyListings());
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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
