import { EtsyImportForm } from "@/components/EtsyImportForm";

export default function ConnectEtsyPage() {
  return (
    <div className="max-w-2xl space-y-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-neutral-500">İlk adım</p>
        <h1 className="mt-1 text-2xl font-semibold">Etsy mağazanı içeri al</h1>
      </div>
      <p className="leading-7 text-neutral-700">
        Etsy mağaza linkini yapıştır. PinPilot ürünleri getirir, sonra ürün seçip Pinterest SEO oluşturursun.
      </p>
      <EtsyImportForm label="Ürünleri getir" />
    </div>
  );
}
