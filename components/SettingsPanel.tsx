import { CheckCircle2, CircleAlert } from "lucide-react";
import {
  isDatabaseConfigured,
  isEtsyConfigured,
  isGeminiConfigured,
  isOpenAiConfigured,
  isPinterestConfigured,
  isSupabaseConfigured
} from "@/lib/env";

const rows = [
  { label: "PostgreSQL database", configured: isDatabaseConfigured },
  { label: "Supabase Auth", configured: isSupabaseConfigured },
  { label: "Gemini API", configured: isGeminiConfigured },
  { label: "OpenAI API", configured: isOpenAiConfigured },
  { label: "Etsy API", configured: isEtsyConfigured },
  { label: "Pinterest API", configured: isPinterestConfigured }
];

export function SettingsPanel() {
  return (
    <section className="max-w-3xl rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Environment status</h2>
      <div className="mt-4 divide-y divide-neutral-100">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between py-3">
            <span className="text-sm font-medium">{row.label}</span>
            <span className={row.configured ? "inline-flex items-center gap-2 text-sm font-medium text-emerald-700" : "inline-flex items-center gap-2 text-sm font-medium text-amber-700"}>
              {row.configured ? <CheckCircle2 className="h-4 w-4" /> : <CircleAlert className="h-4 w-4" />}
              {row.configured ? "Configured" : "Local fallback"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
