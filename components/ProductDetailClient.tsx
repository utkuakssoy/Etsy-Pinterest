"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ProductActions } from "@/components/ProductActions";
import { getStoredEtsyListings } from "@/lib/client-storage";
import { formatCurrency } from "@/lib/utils";
import type { EtsyListingView } from "@/types";

export function ProductDetailClient({
  productId,
  initialProduct
}: {
  productId: string;
  initialProduct: EtsyListingView | null;
}) {
  const [storedProducts, setStoredProducts] = useState<EtsyListingView[]>([]);

  useEffect(() => {
    setStoredProducts(getStoredEtsyListings());
  }, []);

  const product = useMemo(
    () => initialProduct ?? storedProducts.find((item) => item.id === productId) ?? null,
    [initialProduct, productId, storedProducts]
  );

  if (!product) {
    return (
      <section className="rounded-lg border border-neutral-900 bg-[#050505] p-8 text-center">
        <h1 className="text-xl font-semibold text-neutral-100">Product not found</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-500">
          Refresh listings from the dashboard, then open the product again.
        </p>
        <Link href="/dashboard" className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
          Go to dashboard
        </Link>
      </section>
    );
  }

  const imageUrl = product.images[0] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="overflow-hidden rounded-lg border border-neutral-900 bg-[#050505] shadow-sm">
        <Image
          src={imageUrl}
          alt={product.title}
          width={1200}
          height={900}
          priority
          sizes="(min-width: 1280px) 45vw, 100vw"
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      <section className="rounded-lg border border-neutral-900 bg-[#050505] p-6 shadow-sm">
        <p className="text-sm font-medium text-neutral-500">{product.category}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-100">{product.title}</h1>
        <p className="mt-3 text-lg font-semibold text-neutral-300">{formatCurrency(product.price, product.currency)}</p>
        <p className="mt-5 leading-7 text-neutral-500">{product.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-neutral-800 bg-black px-3 py-1 text-xs font-medium text-neutral-500">
              {tag}
            </span>
          ))}
        </div>
        <ProductActions product={product} />
      </section>
    </div>
  );
}
