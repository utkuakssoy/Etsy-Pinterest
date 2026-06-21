"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Download, Link as LinkIcon } from "lucide-react";
import { markEtsyImported } from "@/lib/client-storage";

export function EtsyImportForm({ label }: { label: string }) {
  const router = useRouter();
  const [shopUrl, setShopUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  async function handleImport(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setLoading(true);
    setError(null);
    setImportedCount(null);

    try {
      const response = await fetch("/api/etsy/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shopUrl })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Import failed");
      }
      markEtsyImported();
      setImportedCount(payload.listings?.length ?? 0);
      router.push("/dashboard?imported=1");
      router.refresh();
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleImport} className="w-full max-w-2xl">
      <label className="block text-sm font-semibold">
        <span className="mb-2 block text-base">1. Etsy mağaza linkini yapıştır</span>
        <span className="flex flex-col gap-3 sm:flex-row">
          <span className="relative flex-1">
            <LinkIcon className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-neutral-400" />
            <input
              type="url"
              required
              value={shopUrl}
              onChange={(event) => setShopUrl(event.target.value)}
              placeholder="https://www.etsy.com/shop/YourShopName"
              className="w-full rounded-md border border-neutral-200 bg-white py-3 pl-12 pr-3 text-base focus-ring"
            />
          </span>
          <button
            type="submit"
            disabled={loading || !shopUrl}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-neutral-950 px-5 py-3 text-base font-semibold text-white shadow-sm disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {loading ? "Importing..." : label}
          </button>
        </span>
      </label>
      <p className="mt-2 text-sm text-neutral-500">Örnek: https://www.etsy.com/shop/YourShopName</p>
      {error && <p className="mt-3 text-sm font-medium text-red-700">{error}</p>}
      {importedCount !== null && (
        <p className="mt-3 text-sm font-medium text-emerald-700">
          Imported {importedCount} real Etsy listing{importedCount === 1 ? "" : "s"}.
        </p>
      )}
    </form>
  );
}
