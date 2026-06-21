import type { SeoGenerationResult } from "@/types";

export function SeoResultCard({ result }: { result: SeoGenerationResult }) {
  return (
    <div className="space-y-5 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <ResultSection title="Pinterest başlıkları" items={result.pinterestTitles} />
      <ResultSection title="Pinterest açıklamaları" items={result.pinterestDescriptions} />
      <ResultSection title="Anahtar kelimeler" items={result.keywords} compact />
      <ResultSection title="Pano önerileri" items={result.boardSuggestions} compact />
      <div>
        <h3 className="text-sm font-semibold">Etsy ilan önerisi</h3>
        <p className="mt-2 text-sm font-medium">{result.etsyTitleSuggestion}</p>
        <p className="mt-2 text-sm leading-6 text-neutral-700">{result.etsyDescriptionSuggestion}</p>
      </div>
      <div>
        <h3 className="text-sm font-semibold">Pin fikirleri</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {result.pinConcepts.map((concept) => (
            <div key={`${concept.template}-${concept.headline}`} className="rounded-md border border-neutral-200 p-3">
              <p className="text-sm font-semibold">{concept.headline}</p>
              <p className="mt-1 text-xs font-medium text-neutral-500">{concept.template}</p>
              <p className="mt-2 text-sm leading-5 text-neutral-700">{concept.visualDirection}</p>
              <p className="mt-2 text-xs font-medium text-neutral-500">{concept.targetKeyword}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResultSection({ title, items, compact = false }: { title: string; items: string[]; compact?: boolean }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className={compact ? "mt-2 flex flex-wrap gap-2" : "mt-2 space-y-2"}>
        {items.map((item) => (
          <span
            key={item}
            className={compact ? "rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-700" : "block rounded-md bg-neutral-50 p-3 text-sm leading-6 text-neutral-700"}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
