import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { demoUser } from "@/lib/demo-data";
import { generateSeoForListing } from "@/services/ai";
import type { EtsyListingView } from "@/types";

const listingSchema = z.object({
  id: z.string(),
  shopId: z.string(),
  etsyListingId: z.string(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  currency: z.string(),
  images: z.array(z.string()),
  tags: z.array(z.string()),
  category: z.string(),
  listingUrl: z.string(),
  status: z.enum(["active", "draft", "inactive"]),
  createdAt: z.string(),
  updatedAt: z.string()
});

export async function POST(request: Request) {
  try {
    const listing = listingSchema.parse(await request.json()) as EtsyListingView;
    const output = await generateSeoForListing(listing);

    if (isDatabaseConfigured && !listing.id.startsWith("listing-")) {
      await prisma.aiSeoGeneration.create({
        data: {
          userId: demoUser.id,
          listingId: listing.id,
          input: listing,
          output
        }
      });
    }

    return NextResponse.json({ output });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to generate SEO content";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
