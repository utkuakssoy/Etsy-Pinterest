import { NextResponse } from "next/server";
import { z } from "zod";
import { savePinterestAppCredentials } from "@/services/local-store";

const credentialsSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1)
});

export async function POST(request: Request) {
  try {
    const credentials = credentialsSchema.parse(await request.json());
    savePinterestAppCredentials(credentials);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pinterest bilgileri kaydedilemedi";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
