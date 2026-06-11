import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

const META_APP_ID = process.env.META_APP_ID!;
const META_APP_SECRET = process.env.META_APP_SECRET!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_URL!;
const REDIRECT_URI = `${APP_URL}/api/meta/callback`;
const GRAPH = "https://graph.facebook.com/v21.0";

const STATE_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "automaweb-dev-secret-change-in-production"
);

function fail(reason: string) {
  return NextResponse.redirect(
    `${APP_URL}/tenant/integracoes?error=${reason}`
  );
}

type FacebookPage = {
  id: string;
  name: string;
  access_token: string;
  instagram_business_account?: { id: string };
};

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");

  if (!code) return fail("denied");
  if (!state) return fail("state");

  let tenantId: string;
  try {
    const { payload } = await jwtVerify(state, STATE_SECRET);
    tenantId = payload.tenantId as string;
    if (!tenantId) return fail("state");
  } catch {
    return fail("state");
  }

  // Troca o code por um token de curta duracao
  const tokenUrl = new URL(`${GRAPH}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", META_APP_ID);
  tokenUrl.searchParams.set("client_secret", META_APP_SECRET);
  tokenUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl.toString());
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) return fail("token");

  // Estende pra token de longa duracao (~60 dias)
  const longLivedUrl = new URL(`${GRAPH}/oauth/access_token`);
  longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
  longLivedUrl.searchParams.set("client_id", META_APP_ID);
  longLivedUrl.searchParams.set("client_secret", META_APP_SECRET);
  longLivedUrl.searchParams.set("fb_exchange_token", tokenData.access_token);

  const longLivedRes = await fetch(longLivedUrl.toString());
  const longLivedData = await longLivedRes.json();

  const accessToken = longLivedData.access_token ?? tokenData.access_token;
  const expiresIn = longLivedData.expires_in ?? 5184000;

  // Busca TODAS as paginas e acha a que tem Instagram Business conectado
  const pagesRes = await fetch(
    `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account&limit=100&access_token=${accessToken}`
  );
  const pagesData = await pagesRes.json();
  const pages: FacebookPage[] = pagesData.data ?? [];

  if (pages.length === 0) return fail("no_page");

  const page = pages.find((p) => p.instagram_business_account) ?? null;
  if (!page?.instagram_business_account) return fail("no_ig");

  const igUserId = page.instagram_business_account.id;

  const igProfileRes = await fetch(
    `${GRAPH}/${igUserId}?fields=username,profile_picture_url&access_token=${page.access_token}`
  );
  const igProfile = await igProfileRes.json();

  const connectionData = {
    igUserId,
    igUsername: igProfile.username ?? null,
    igProfilePic: igProfile.profile_picture_url ?? null,
    pageId: page.id,
    pageName: page.name,
    accessToken: page.access_token,
    tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
    connectedAt: new Date(),
    status: "CONECTADO" as const,
    // conexao renovada: zera o ciclo de avisos de vencimento
    ultimoAvisoDias: null,
  };

  await db.metaConnection.upsert({
    where: { tenantId },
    create: { tenantId, ...connectionData },
    update: connectionData,
  });

  return NextResponse.redirect(
    `${APP_URL}/tenant/integracoes?connected=true`
  );
}
