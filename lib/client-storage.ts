import type { EtsyListingView, PinDraftView } from "@/types";

const IMPORT_KEY = "pinpilot:etsy-imported";
const ETSY_IMPORT_KEY = "pinpilot:etsy-import";
const LAST_IMPORTED_IDS_KEY = "pinpilot:last-imported-listing-ids";
const PIN_DRAFTS_KEY = "pinpilot:pin-drafts";
const PIN_DRAFTS_EVENT = "pinpilot:pin-drafts-updated";

export type StoredEtsyImport = {
  shop?: {
    id: string;
    etsyShopId: string;
    name: string;
    url: string;
  };
  listings: EtsyListingView[];
  importedAt?: string;
  importWarning?: string;
};

export function markEtsyImported() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(IMPORT_KEY, "true");
}

export function saveImportedEtsyShop(importedShop: StoredEtsyImport) {
  if (typeof window === "undefined") {
    return { addedCount: 0, totalCount: importedShop.listings.length };
  }

  const currentListings = getStoredEtsyListings();
  const seen = new Set(currentListings.map((listing) => listing.etsyListingId));
  const newListings: EtsyListingView[] = [];

  for (const listing of importedShop.listings) {
    if (seen.has(listing.etsyListingId)) {
      continue;
    }

    seen.add(listing.etsyListingId);
    newListings.push(listing);
  }

  const mergedListings = [...newListings, ...currentListings];
  const newListingIds = newListings.map((listing) => listing.id);

  window.localStorage.setItem(IMPORT_KEY, "true");
  window.localStorage.setItem(ETSY_IMPORT_KEY, JSON.stringify({ ...importedShop, listings: mergedListings }));
  window.localStorage.setItem(LAST_IMPORTED_IDS_KEY, JSON.stringify(newListingIds));

  return {
    addedCount: newListings.length,
    totalCount: mergedListings.length
  };
}

export function getStoredEtsyListings() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const importedShop = JSON.parse(window.localStorage.getItem(ETSY_IMPORT_KEY) ?? "null") as StoredEtsyImport | null;
    return importedShop?.listings ?? [];
  } catch {
    return [];
  }
}

export function getLastImportedListingIds() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(LAST_IMPORTED_IDS_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

export function hasImportedEtsy() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(IMPORT_KEY) === "true";
}

export function getStoredPinDrafts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem(PIN_DRAFTS_KEY) ?? "[]") as PinDraftView[];
  } catch {
    return [];
  }
}

export function savePinDraft(draft: PinDraftView) {
  if (typeof window === "undefined") {
    return;
  }

  const drafts = getStoredPinDrafts();
  const nextDrafts = [draft, ...drafts.filter((item) => item.id !== draft.id)];
  window.localStorage.setItem(PIN_DRAFTS_KEY, JSON.stringify(nextDrafts));
  window.dispatchEvent(new Event(PIN_DRAFTS_EVENT));
}

export function updateStoredPinDraft(draft: PinDraftView) {
  if (typeof window === "undefined") {
    return;
  }

  const drafts = getStoredPinDrafts();
  window.localStorage.setItem(
    PIN_DRAFTS_KEY,
    JSON.stringify(drafts.map((item) => (item.id === draft.id ? draft : item)))
  );
  window.dispatchEvent(new Event(PIN_DRAFTS_EVENT));
}

export function onPinDraftsChanged(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(PIN_DRAFTS_EVENT, callback);
  return () => window.removeEventListener(PIN_DRAFTS_EVENT, callback);
}
