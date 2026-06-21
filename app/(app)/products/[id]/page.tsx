import { ProductDetailClient } from "@/components/ProductDetailClient";
import { getEtsyListings } from "@/services/etsy";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const initialProduct = (await getEtsyListings()).find((item) => item.id === id) ?? null;

  return <ProductDetailClient productId={id} initialProduct={initialProduct} />;
}
