import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { exchangePinterestCode } from "@/services/pinterest";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("pinpilot_pinterest_oauth_state")?.value;

  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/connect/pinterest?error=Pinterest authorization failed", request.url));
  }

  try {
    await exchangePinterestCode({
      code,
      redirectUri: `${url.origin}/api/pinterest/oauth/callback`
    });

    const response = NextResponse.redirect(new URL("/settings?connected=1", request.url));
    response.cookies.delete("pinpilot_pinterest_oauth_state");
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pinterest authorization failed";
    return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(message)}`, request.url));
  }
}
