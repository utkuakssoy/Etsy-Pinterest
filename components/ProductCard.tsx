import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import type { EtsyListingView } from "@/types";

export function ProductCard({ product }: { product: EtsyListingView }) {
  const imageUrl = product.images[0] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  return (
    <Link href={`/products/${product.id}`} className="group overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Image
        src={imageUrl}
        alt={product.title}
        width={800}
        height={600}
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{product.category.split("/").pop()?.trim()}</p>
        <h3 className="mt-2 line-clamp-2 min-h-11 text-sm font-semibold leading-5 group-hover:underline">{product.title}</h3>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold">{formatCurrency(product.price, product.currency)}</span>
          <span className="rounded-full bg-neutral-100 px-2 py-1 text-xs font-medium capitalize text-neutral-600">{product.status}</span>
        </div>
      </div>
    </Link>
  );
}
