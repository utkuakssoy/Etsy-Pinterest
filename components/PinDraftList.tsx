"use client";

import { useEffect, useState } from "react";
import { PinDraftCard } from "@/components/PinDraftCard";
import { getStoredPinDrafts } from "@/lib/client-storage";
import type { PinDraftView } from "@/types";

export function PinDraftList({ initialDrafts }: { initialDrafts: PinDraftView[] }) {
  const [drafts, setDrafts] = useState(initialDrafts);

  useEffect(() => {
    const stored = getStoredPinDrafts();
    setDrafts([...stored, ...initialDrafts.filter((draft) => !stored.some((item) => item.id === draft.id))]);
  }, [initialDrafts]);

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      {drafts.map((draft) => (
        <PinDraftCard key={draft.id} draft={draft} />
      ))}
    </section>
  );
}
