import { PinDraftCreator } from "@/components/PinDraftCreator";
import { PinDraftList } from "@/components/PinDraftList";
import { getEtsyListings } from "@/services/etsy";
import { getPinterestBoards, isPinterestConnected } from "@/services/pinterest";
import Link from "next/link";
import { Lock } from "lucide-react";

export default async function PinsPage() {
  const connected = isPinterestConnected();
  const [products, boards] = await Promise.all([
    getEtsyListings(),
    connected ? getPinterestBoards() : Promise.resolve([])
  ]);

  return (
    <div className="space-y-5">
      <header>
        <p className="text-sm font-medium text-neutral-500">Content</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-100">Pin drafts</h1>
      </header>
      {!connected ? (
        <section className="rounded-lg border border-neutral-900 bg-[#050505] p-8 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-full border border-neutral-800 bg-black text-neutral-400">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-neutral-100">Connect your account first</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-neutral-500">
            Drafts are created only for your connected account. Mock content is not shown.
          </p>
          <Link href="/settings" className="mt-5 inline-flex rounded-md bg-white px-4 py-2 text-sm font-semibold text-black">
            Go to settings
          </Link>
        </section>
      ) : (
        <>
          <PinDraftCreator products={products} boards={boards} />
          <PinDraftList initialDrafts={[]} />
        </>
      )}
    </div>
  );
}
