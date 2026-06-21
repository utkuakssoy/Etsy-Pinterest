import { PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ProductCard } from "@/components/ProductCard";
import type { EtsyListingView } from "@/types";

export function ProductGrid({ products }: { products: EtsyListingView[] }) {
  if (!products.length) {
    return <EmptyState icon={PackageSearch} title="Henüz ürün yok" description="Önce dashboard ekranına git, Etsy mağaza linkini yapıştır ve ürünleri getir." />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
