import { NextResponse } from "next/server";
import { z } from "zod";
import { readAiCredentials, saveAiCredentials } from "@/services/local-store";

const credentialsSchema = z.object({
  geminiApiKey: z.string().optional(),
  openaiApiKey: z.string().optional()
});

export async function GET() {
  const credentials = readAiCredentials();

  return NextResponse.json({
    geminiApiKey: credentials?.geminiApiKey ?? "",
    openaiApiKey: credentials?.openaiApiKey ?? ""
  });
}

export async function POST(request: Request) {
  try {
    const credentials = credentialsSchema.parse(await request.json());
    if (!credentials.geminiApiKey && !credentials.openaiApiKey) {
      return NextResponse.json({ error: "Enter a Gemini or OpenAI API key." }, { status: 400 });
    }

    saveAiCredentials({
      geminiApiKey: credentials.geminiApiKey || undefined,
      openaiApiKey: credentials.openaiApiKey || undefined
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "AI credentials could not be saved";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
