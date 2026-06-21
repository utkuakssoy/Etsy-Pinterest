import { NextResponse } from "next/server";
import { getPinterestAuthorizeUrl } from "@/services/pinterest";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const redirectUri = `${url.origin}/api/pinterest/oauth/callback`;
    const state = crypto.randomUUID();
    const authorizeUrl = getPinterestAuthorizeUrl({ redirectUri, state });

    const response = NextResponse.redirect(authorizeUrl);
    response.cookies.set("pinpilot_pinterest_oauth_state", state, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 10,
      path: "/"
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start Pinterest connection";
    return NextResponse.redirect(new URL(`/settings?error=${encodeURIComponent(message)}`, request.url));
  }
}
