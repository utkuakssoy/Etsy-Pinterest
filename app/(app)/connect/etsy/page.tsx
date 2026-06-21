import { EtsyImportForm } from "@/components/EtsyImportForm";

export default function ConnectEtsyPage() {
  return (
    <div className="max-w-2xl rounded-lg border border-neutral-900 bg-[#050505] p-5 shadow-sm">
      <p className="text-sm font-medium text-neutral-500">Import</p>
      <h1 className="mt-1 text-2xl font-semibold text-neutral-100">Connect Etsy shop</h1>
      <p className="mt-2 text-sm leading-6 text-neutral-500">
        Paste your shop link to import real product listings.
      </p>
      <div className="mt-5">
        <EtsyImportForm label="Import products" />
      </div>
    </div>
  );
}
