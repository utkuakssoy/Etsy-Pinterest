import { NextResponse } from "next/server";
import { z } from "zod";
import { readPinterestAppCredentials, savePinterestAppCredentials } from "@/services/local-store";

const credentialsSchema = z.object({
  clientId: z.string().min(1),
  clientSecret: z.string().min(1)
});

export async function GET() {
  const credentials = readPinterestAppCredentials();

  return NextResponse.json({
    clientId: credentials?.clientId ?? "",
    clientSecret: credentials?.clientSecret ?? ""
  });
}

export async function POST(request: Request) {
  try {
    const credentials = credentialsSchema.parse(await request.json());
    savePinterestAppCredentials(credentials);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Account credentials could not be saved";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
