import { NextRequest, NextResponse } from "next/server";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const BASE_URL = process.env.NEXT_PUBLIC_URL ?? "https://automaweb.pro";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${BASE_URL}/login?error=google_denied`);
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${BASE_URL}/login?error=google_token`);
  }

  const tokens = await tokenRes.json();

  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(`${BASE_URL}/login?error=google_profile`);
  }

  const profile = await userRes.json();
  const email = (profile.email as string)?.trim().toLowerCase();

  const user = await db.user.findUnique({
    where: { email },
    include: { tenant: true },
  });

  if (!user) {
    return NextResponse.redirect(`${BASE_URL}/login?error=no_account`);
  }

  await createSession({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId ?? undefined,
    tenantSlug: user.tenant?.slug,
  });

  const dest = user.role === "MASTER" ? "/master" : "/tenant";
  return NextResponse.redirect(`${BASE_URL}${dest}`);
}
