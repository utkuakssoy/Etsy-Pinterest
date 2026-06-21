"use client";

import { useEffect, useState } from "react";
import { PinDraftCard } from "@/components/PinDraftCard";
import { getStoredPinDrafts, onPinDraftsChanged } from "@/lib/client-storage";
import type { PinDraftView } from "@/types";

export function PinDraftList({ initialDrafts = [] }: { initialDrafts?: PinDraftView[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);

  useEffect(() => {
    const syncDrafts = () => setDrafts(getStoredPinDrafts());
    syncDrafts();
    return onPinDraftsChanged(syncDrafts);
  }, [initialDrafts]);

  if (!drafts.length) {
    return (
      <section className="rounded-lg border border-neutral-900 bg-[#050505] p-6 text-center">
        <h2 className="text-base font-semibold text-neutral-100">No drafts yet</h2>
        <p className="mt-2 text-sm text-neutral-500">Created drafts will appear here.</p>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {drafts.map((draft) => (
        <PinDraftCard key={draft.id} draft={draft} />
      ))}
    </section>
  );
}
