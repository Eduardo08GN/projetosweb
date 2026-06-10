import { NextResponse } from "next/server";
import { SignJWT } from "jose";
import { getSession } from "@/lib/auth";

const META_APP_ID = process.env.META_APP_ID!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_URL!;
const REDIRECT_URI = `${APP_URL}/api/meta/callback`;

const STATE_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "automaweb-dev-secret-change-in-production"
);

const SCOPES = [
  "instagram_basic",
  "instagram_content_publish",
  "pages_show_list",
  "pages_read_engagement",
].join(",");

export async function GET() {
  const session = await getSession();
  if (!session?.tenantId) {
    return NextResponse.redirect(`${APP_URL}/login`);
  }

  // state identifica o tenant que iniciou a conexao e protege contra CSRF
  const state = await new SignJWT({ tenantId: session.tenantId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(STATE_SECRET);

  const authUrl = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  authUrl.searchParams.set("client_id", META_APP_ID);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("state", state);

  return NextResponse.redirect(authUrl.toString());
}
