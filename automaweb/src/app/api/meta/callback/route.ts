import { NextRequest, NextResponse } from "next/server";

const META_APP_ID = process.env.META_APP_ID!;
const META_APP_SECRET = process.env.META_APP_SECRET!;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/meta/callback`;

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/tenant/integracoes?error=denied`
    );
  }

  const tokenUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  tokenUrl.searchParams.set("client_id", META_APP_ID);
  tokenUrl.searchParams.set("client_secret", META_APP_SECRET);
  tokenUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  tokenUrl.searchParams.set("code", code);

  const tokenRes = await fetch(tokenUrl.toString());
  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/tenant/integracoes?error=token`
    );
  }

  const longLivedUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
  longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
  longLivedUrl.searchParams.set("client_id", META_APP_ID);
  longLivedUrl.searchParams.set("client_secret", META_APP_SECRET);
  longLivedUrl.searchParams.set("fb_exchange_token", tokenData.access_token);

  const longLivedRes = await fetch(longLivedUrl.toString());
  const longLivedData = await longLivedRes.json();

  const accessToken = longLivedData.access_token ?? tokenData.access_token;
  const expiresIn = longLivedData.expires_in ?? 5184000;

  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}`
  );
  const pagesData = await pagesRes.json();
  const page = pagesData.data?.[0];

  if (!page) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/tenant/integracoes?error=no_page`
    );
  }

  const igRes = await fetch(
    `https://graph.facebook.com/v21.0/${page.id}?fields=instagram_business_account&access_token=${page.access_token}`
  );
  const igData = await igRes.json();
  const igUserId = igData.instagram_business_account?.id;

  if (!igUserId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/tenant/integracoes?error=no_ig`
    );
  }

  const igProfileRes = await fetch(
    `https://graph.facebook.com/v21.0/${igUserId}?fields=username,profile_picture_url&access_token=${page.access_token}`
  );
  const igProfile = await igProfileRes.json();

  // TODO: save to database via Prisma
  // await db.metaConnection.upsert({
  //   where: { tenantId },
  //   create: {
  //     tenantId,
  //     igUserId,
  //     igUsername: igProfile.username,
  //     igProfilePic: igProfile.profile_picture_url,
  //     pageId: page.id,
  //     pageName: page.name,
  //     accessToken: page.access_token,
  //     tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
  //     connectedAt: new Date(),
  //     status: "CONECTADO",
  //   },
  //   update: {
  //     igUserId,
  //     igUsername: igProfile.username,
  //     igProfilePic: igProfile.profile_picture_url,
  //     pageId: page.id,
  //     pageName: page.name,
  //     accessToken: page.access_token,
  //     tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
  //     connectedAt: new Date(),
  //     status: "CONECTADO",
  //   },
  // });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/tenant/integracoes?connected=true`
  );
}
