"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";

export function AiCredentialsForm() {
  const [geminiApiKey, setGeminiApiKey] = useState("");
  const [openaiApiKey, setOpenaiApiKey] = useState("");
  const [showGemini, setShowGemini] = useState(false);
  const [showOpenAi, setShowOpenAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCredentials() {
      try {
        const response = await fetch("/api/ai/credentials", { cache: "no-store" });
        const payload = await response.json();

        if (!active || !response.ok) {
          return;
        }

        setGeminiApiKey(payload.geminiApiKey ?? "");
        setOpenaiApiKey(payload.openaiApiKey ?? "");
      } catch {
        // Keep the form empty if credentials cannot be loaded.
      }
    }

    loadCredentials();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch("/api/ai/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ geminiApiKey, openaiApiKey })
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Could not save API key");
      }

      setMessage("AI API key saved.");
      setShowGemini(false);
      setShowOpenAi(false);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save API key");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 rounded-md border border-neutral-900 bg-black p-4">
      <p className="text-sm font-semibold text-neutral-100">AI API key</p>
      <p className="mt-1 text-sm leading-6 text-neutral-500">Saved keys stay hidden. Use the eye button to reveal them.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <SecretField
          label="Gemini API key"
          value={geminiApiKey}
          placeholder="AIza..."
          visible={showGemini}
          onToggle={() => setShowGemini((current) => !current)}
          onChange={setGeminiApiKey}
        />
        <SecretField
          label="OpenAI API key"
          value={openaiApiKey}
          placeholder="sk-..."
          visible={showOpenAi}
          onToggle={() => setShowOpenAi((current) => !current)}
          onChange={setOpenaiApiKey}
        />
      </div>
      <button
        disabled={loading || (!geminiApiKey && !openaiApiKey)}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-black shadow-sm disabled:opacity-60"
      >
        <Save className="h-4 w-4" />
        {loading ? "Saving..." : "Save AI key"}
      </button>
      {message && <p className="mt-3 text-sm font-semibold text-emerald-400">{message}</p>}
      {error && <p className="mt-3 text-sm font-semibold text-red-400">{error}</p>}
    </form>
  );
}

function SecretField({
  label,
  value,
  placeholder,
  visible,
  onToggle,
  onChange
}: {
  label: string;
  value: string;
  placeholder: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
}) {
  const Icon = visible ? EyeOff : Eye;

  return (
    <label className="block text-sm font-semibold text-neutral-300">
      <span className="mb-2 block">{label}</span>
      <span className="relative block">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-neutral-800 bg-neutral-950 px-3 py-2 pr-10 text-sm text-neutral-100 placeholder:text-neutral-600 focus-ring"
          placeholder={placeholder}
          type={visible ? "text" : "password"}
        />
        <button
          type="button"
          onClick={onToggle}
          disabled={!value}
          aria-label={visible ? `Hide ${label}` : `Show ${label}`}
          className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-neutral-500 hover:bg-neutral-900 hover:text-neutral-100 disabled:opacity-30"
        >
          <Icon className="h-4 w-4" />
        </button>
      </span>
    </label>
  );
}
