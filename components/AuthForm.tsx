"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setMessage("Supabase is not configured, so PinPilot is running in demo mode.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) {
      setError(authError.message);
    } else {
      setMessage("Check your email for the login link.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-neutral-500">Sign in</p>
        <h1 className="mt-1 text-2xl font-semibold">Access PinPilot</h1>
      </div>
      <label className="mt-5 block text-sm font-semibold">
        <span className="mb-2 block">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm focus-ring"
          placeholder="seller@example.com"
        />
      </label>
      <button
        disabled={loading}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white shadow-sm disabled:opacity-60"
      >
        <Mail className="h-4 w-4" />
        {loading ? "Sending..." : "Send magic link"}
      </button>
      <Link
        href="/connect/etsy"
        className="mt-3 inline-flex w-full items-center justify-center rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium shadow-sm"
      >
        Continue in demo mode
      </Link>
      {message && <p className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
      {error && <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    </form>
  );
}
