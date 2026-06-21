import { PinDraftCreator } from "@/components/PinDraftCreator";
import { PinDraftList } from "@/components/PinDraftList";
import { getEtsyListings } from "@/services/etsy";
import { getPinterestBoards, getPinterestPinDrafts } from "@/services/pinterest";

export default async function PinsPage() {
  const [products, boards, drafts] = await Promise.all([
    getEtsyListings(),
    getPinterestBoards(),
    getPinterestPinDrafts()
  ]);

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-medium text-neutral-500">Pinterest content</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Pin Drafts</h1>
      </header>
      <PinDraftCreator products={products} boards={boards} />
      <PinDraftList initialDrafts={drafts} />
    </div>
  );
}
