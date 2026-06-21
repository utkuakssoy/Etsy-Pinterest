import { getPinterestPinDrafts } from "@/services/pinterest";

export async function runScheduledPinsJob() {
  const now = Date.now();
  const drafts = await getPinterestPinDrafts();

  return drafts.filter((draft) => {
    if (!draft.scheduledAt || draft.status !== "scheduled") {
      return false;
    }

    return new Date(draft.scheduledAt).getTime() <= now;
  });
}
