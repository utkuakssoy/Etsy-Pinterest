import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductActions } from "@/components/ProductActions";
import { getEtsyListings } from "@/services/etsy";
import { formatCurrency } from "@/lib/utils";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = (await getEtsyListings()).find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const imageUrl = product.images[0] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <Image
          src={imageUrl}
          alt={product.title}
          width={1200}
          height={900}
          className="aspect-[4/3] w-full object-cover"
        />
      </div>
      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-neutral-500">{product.category}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.title}</h1>
        <p className="mt-3 text-lg font-semibold">{formatCurrency(product.price, product.currency)}</p>
        <p className="mt-5 leading-7 text-neutral-700">{product.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600">
              {tag}
            </span>
          ))}
        </div>
        <ProductActions product={product} />
      </section>
    </div>
  );
}
