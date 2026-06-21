import Link from "next/link";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import type { EtsyListingView } from "@/types";

export function ProductActions({ product }: { product: EtsyListingView }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <Link href={`/generate?product=${product.id}`} className="inline-flex items-center gap-2 rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm">
        <Sparkles className="h-4 w-4" />
        Pinterest SEO oluştur
      </Link>
      <Link href="/pins" className="inline-flex items-center gap-2 rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm">
        <ImageIcon className="h-4 w-4" />
        Pin oluştur
      </Link>
    </div>
  );
}
