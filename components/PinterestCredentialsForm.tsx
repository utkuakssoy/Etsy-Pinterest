"use client";

import { useState } from "react";
import { Save } from "lucide-react";

export function PinterestCredentialsForm() {
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/pinterest/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Kaydedilemedi");
      }
      setMessage("Kaydedildi. Simdi Pinterest'e giris yapabilirsin.");
      setClientSecret("");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Kaydedilemedi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-4">
      <p className="text-sm font-semibold">Bir defalik Pinterest app bilgileri</p>
      <p className="mt-1 text-sm leading-6 text-neutral-600">
        Bunlar Pinterest&apos;in guvenlik icin istedigi uygulama kimlikleri. Kullanici adi veya sifre degil.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <label className="block text-sm font-semibold">
          <span className="mb-2 block">Client ID</span>
          <input
            value={clientId}
            onChange={(event) => setClientId(event.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus-ring"
            placeholder="Pinterest Client ID"
          />
        </label>
        <label className="block text-sm font-semibold">
          <span className="mb-2 block">Client Secret</span>
          <input
            value={clientSecret}
            onChange={(event) => setClientSecret(event.target.value)}
            className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm focus-ring"
            placeholder="Pinterest Client Secret"
            type="password"
          />
        </label>
      </div>
      <button
        disabled={loading || !clientId || !clientSecret}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-neutral-200 disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {loading ? "Kaydediliyor..." : "Bilgileri kaydet"}
      </button>
      {message && <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>}
    </form>
  );
}
