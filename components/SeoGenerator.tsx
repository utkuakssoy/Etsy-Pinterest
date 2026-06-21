"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ImagePlus, Sparkles } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import { SeoResultCard } from "@/components/SeoResultCard";
import { savePinDraft } from "@/lib/client-storage";
import type { EtsyListingView, PinDraftView, PinterestBoardView, SeoGenerationResult } from "@/types";

export function SeoGenerator({
  products,
  boards,
  initialProductId
}: {
  products: EtsyListingView[];
  boards: PinterestBoardView[];
  initialProductId?: string;
}) {
  const initialProduct = products.find((product) => product.id === initialProductId) ?? products[0];
  const [productId, setProductId] = useState(initialProduct?.id ?? "");
  const [boardId, setBoardId] = useState(boards[0]?.id ?? "");
  const [result, setResult] = useState<SeoGenerationResult | null>(null);
  const [createdDraft, setCreatedDraft] = useState<PinDraftView | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draftError, setDraftError] = useState<string | null>(null);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId) ?? products[0],
    [productId, products]
  );

  async function handleGenerate() {
    if (!selectedProduct) {
      return;
    }

    setLoading(true);
    setError(null);
    setDraftError(null);
    setCreatedDraft(null);

    try {
      const response = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedProduct)
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Generation failed");
      }

      setResult(payload.output);
    } catch (generationError) {
      setError(generationError instanceof Error ? generationError.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDraft() {
    if (!selectedProduct || !result || !boardId) {
      return;
    }

    setDraftLoading(true);
    setDraftError(null);

    try {
      const response = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          boardId,
          title: result.pinterestTitles[0] ?? selectedProduct.title,
          description: result.pinterestDescriptions[0] ?? "",
          destinationUrl: selectedProduct.listingUrl,
          imageUrl: selectedProduct.images[0] || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          status: "draft",
          scheduledAt: null
        })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to create draft");
      }

      const draft = payload.draft as PinDraftView;
      savePinDraft(draft);
      setCreatedDraft(draft);
    } catch (draftCreationError) {
      setDraftError(draftCreationError instanceof Error ? draftCreationError.message : "Unable to create draft");
    } finally {
      setDraftLoading(false);
    }
  }

  if (!products.length) {
    return (
      <section className="rounded-lg border border-neutral-900 bg-[#050505] p-6 text-center">
        <h2 className="text-lg font-semibold text-neutral-100">Import products first</h2>
        <p className="mt-2 text-sm text-neutral-500">SEO generation starts after your Etsy products are imported.</p>
        <Link href="/connect/etsy" className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
          Import products
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-neutral-900 bg-[#050505] p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-100">Generate content</h2>
        <p className="mt-1 text-sm text-neutral-500">Choose a product and generate real AI content using your saved API key.</p>

        <label className="mt-5 block text-sm font-semibold text-neutral-200" htmlFor="product">
          Product
        </label>
        <select
          id="product"
          className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-100 focus-ring"
          value={productId}
          onChange={(event) => {
            setProductId(event.target.value);
            setResult(null);
            setCreatedDraft(null);
            setDraftError(null);
          }}
        >
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title}
            </option>
          ))}
        </select>

        <button
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleGenerate}
          disabled={loading || !selectedProduct}
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating..." : "Generate"}
        </button>

        {loading && <div className="mt-4"><LoadingState label="Generating content" /></div>}
        {error && <p className="mt-4 rounded-md border border-red-900/70 bg-red-950/30 p-3 text-sm text-red-200">{error}</p>}
      </section>

      {result ? (
        <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <SeoResultCard result={result} />
          <div className="h-fit rounded-lg border border-neutral-900 bg-[#050505] p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-100">Save draft</h2>
            <p className="mt-1 text-sm leading-6 text-neutral-500">Choose a board and save the first generated title and description as a draft.</p>

            {boards.length ? (
              <>
                <label className="mt-4 block text-sm font-semibold text-neutral-200">
                  Board
                  <select
                    className="mt-2 w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-3 text-sm text-neutral-100 focus-ring"
                    value={boardId}
                    onChange={(event) => setBoardId(event.target.value)}
                  >
                    {boards.map((board) => (
                      <option key={board.id} value={board.id}>{board.name}</option>
                    ))}
                  </select>
                </label>
                <button
                  onClick={handleCreateDraft}
                  disabled={draftLoading || !boardId}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black shadow-sm disabled:opacity-60"
                >
                  <ImagePlus className="h-4 w-4" />
                  {draftLoading ? "Saving..." : "Save draft"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="mt-4 rounded-md border border-amber-900/60 bg-amber-950/20 p-4">
                <p className="text-sm font-semibold text-amber-300">Connect an account with board access first.</p>
                <Link href="/settings" className="mt-3 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
                  Go to settings
                </Link>
              </div>
            )}

            {createdDraft && <p className="mt-4 text-sm font-medium text-emerald-400">Draft saved.</p>}
            {draftError && <p className="mt-4 text-sm font-medium text-red-400">{draftError}</p>}
          </div>
        </section>
      ) : (
        <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-neutral-800 bg-[#050505] p-8 text-center text-sm text-neutral-500">
          Generated content will appear here.
        </div>
      )}
    </div>
  );
}
