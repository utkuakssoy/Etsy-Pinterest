import { NextResponse } from "next/server";
import { z } from "zod";
import { createPinterestPinDraft } from "@/services/pinterest";

const pinDraftSchema = z.object({
  productId: z.string(),
  boardId: z.string(),
  title: z.string().min(1),
  description: z.string().min(1),
  destinationUrl: z.string().url(),
  imageUrl: z.string().url(),
  status: z.enum(["draft", "scheduled", "published", "failed"]).default("draft"),
  scheduledAt: z.string().nullable()
});

export async function POST(request: Request) {
  try {
    const input = pinDraftSchema.parse(await request.json());
    const draft = await createPinterestPinDraft(input);
    return NextResponse.json({ draft });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create pin draft";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
