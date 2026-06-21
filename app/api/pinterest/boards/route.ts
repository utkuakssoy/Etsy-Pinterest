import { NextResponse } from "next/server";
import { getPinterestBoards, isPinterestConnected } from "@/services/pinterest";

export async function GET() {
  try {
    return NextResponse.json({
      connected: isPinterestConnected(),
      boards: await getPinterestBoards()
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Pinterest boards";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
