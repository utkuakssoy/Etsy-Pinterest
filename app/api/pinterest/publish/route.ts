import { NextResponse } from "next/server";
import { z } from "zod";
import { publishPinterestPin } from "@/services/pinterest";

const publishSchema = z.object({
  id: z.string(),
  productId: z.string(),
  boardId: z.string(),
  title: z.string(),
  description: z.string(),
  destinationUrl: z.string().url(),
  imageUrl: z.string().url(),
  status: z.enum(["draft", "scheduled", "published", "failed"]),
  scheduledAt: z.string().nullable(),
  createdAt: z.string()
});

export async function POST(request: Request) {
  try {
    const draft = publishSchema.parse(await request.json());
    const publishedPin = await publishPinterestPin(draft);
    return NextResponse.json({ publishedPin });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to publish Pinterest pin";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
