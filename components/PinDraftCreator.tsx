"use client";

import { useMemo, useState } from "react";
import { ImagePlus } from "lucide-react";
import { savePinDraft } from "@/lib/client-storage";
import type { EtsyListingView, PinDraftView, PinterestBoardView } from "@/types";

export function PinDraftCreator({ products, boards }: { products: EtsyListingView[]; boards: PinterestBoardView[] }) {
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [boardId, setBoardId] = useState(boards[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [createdDraft, setCreatedDraft] = useState<PinDraftView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const product = useMemo(() => products.find((item) => item.id === productId) ?? products[0], [productId, products]);

  function handleProductChange(nextProductId: string) {
    const nextProduct = products.find((item) => item.id === nextProductId);
    setProductId(nextProductId);
    if (nextProduct) {
      setTitle("");
      setDescription("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!product) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          boardId,
          title,
          description,
          destinationUrl: product.listingUrl,
          imageUrl: product.images[0] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          status: "draft",
          scheduledAt: null
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create draft");
      }
      savePinDraft(payload.draft);
      setCreatedDraft(payload.draft);
    } catch (draftError) {
      setError(draftError instanceof Error ? draftError.message : "Unable to create draft");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-neutral-900 bg-[#050505] p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-neutral-100">Create a draft</h2>
        <p className="mt-1 text-sm text-neutral-500">Pick one product and write the post text. Nothing is published automatically.</p>
      </div>

      {!products.length && <p className="rounded-md border border-amber-900/70 bg-amber-950/30 p-3 text-sm text-amber-200">Import Etsy products first.</p>}
      {products.length > 0 && !boards.length && <p className="rounded-md border border-amber-900/70 bg-amber-950/30 p-3 text-sm text-amber-200">No boards found. Connect an account with board access in Settings.</p>}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Product">
          <select className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus-ring" value={productId} onChange={(event) => handleProductChange(event.target.value)}>
            {products.map((item) => (
              <option key={item.id} value={item.id}>{item.title}</option>
            ))}
          </select>
        </Field>
        <Field label="Board">
          <select className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 focus-ring" value={boardId} onChange={(event) => setBoardId(event.target.value)}>
            {boards.map((board) => (
              <option key={board.id} value={board.id}>{board.name}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Pin title">
          <input className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600 focus-ring" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Short clear title" />
        </Field>
      </div>
      <Field label="Pin description" className="mt-4">
        <textarea className="min-h-24 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm leading-6 text-neutral-100 placeholder:text-neutral-600 focus-ring" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Write a natural description" />
      </Field>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button className="inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm disabled:opacity-60" disabled={loading || !products.length || !boards.length}>
          <ImagePlus className="h-4 w-4" />
          {loading ? "Creating..." : "Create pin draft"}
        </button>
        {createdDraft && <p className="text-sm font-medium text-emerald-400">Draft created.</p>}
        {error && <p className="text-sm font-medium text-red-400">{error}</p>}
      </div>
    </form>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block text-sm font-semibold text-neutral-200 ${className}`}>
      <span className="mb-2 block">{label}</span>
      {children}
    </label>
  );
}
