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
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-neutral-500">Pin hazırlama</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">SEO oluştur ve pin kaydet</h1>
      </header>
      <SeoGenerator products={products} boards={boards} initialProductId={product} />
    </div>
  );
}
