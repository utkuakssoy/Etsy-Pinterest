import { SeoGenerator } from "@/components/SeoGenerator";
import { getEtsyListings } from "@/services/etsy";
import { getPinterestBoards } from "@/services/pinterest";

export default async function GeneratePage({
  searchParams
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const [{ product }, products, boards] = await Promise.all([
    searchParams,
    getEtsyListings(),
    getPinterestBoards()
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <header>
        <p className="text-sm font-medium text-neutral-500">AI content</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100">Generate and save a draft</h1>
      </header>
      <SeoGenerator products={products} boards={boards} initialProductId={product} />
    </div>
  );
}
