import type { PinDraftView } from "@/types";

const IMPORT_KEY = "pinpilot:etsy-imported";
const PIN_DRAFTS_KEY = "pinpilot:pin-drafts";
const PIN_DRAFTS_EVENT = "pinpilot:pin-drafts-updated";

export function markEtsyImported() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(IMPORT_KEY, "true");
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
