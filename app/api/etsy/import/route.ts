import { NextResponse } from "next/server";
import { importEtsyShop } from "@/services/etsy";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await importEtsyShop(body.shopUrl);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to import Etsy shop";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
