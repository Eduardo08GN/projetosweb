import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "automaweb-dev-secret-change-in-production"
);

const PUBLIC_PATHS = [
  "/home",
  "/login",
  "/api/meta/callback",
  "/api/auth/google",
  // webhook do gateway de cobranca: autentica por token proprio na rota
  "/api/asaas/webhook",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(png|jpg|svg|ico)$/)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("automaweb-session")?.value;

  if (!token) {
    // Visitante sem sessão: raiz leva pra landing, resto pro login
    const dest = pathname === "/" ? "/home" : "/login";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET);
    const role = payload.role as string;

    if (pathname.startsWith("/master") && role !== "MASTER") {
      return NextResponse.redirect(new URL("/tenant", request.url));
    }

    if (pathname.startsWith("/tenant") && role !== "TENANT") {
      return NextResponse.redirect(new URL("/master", request.url));
    }

    if (pathname === "/") {
      const dest = role === "MASTER" ? "/master" : "/tenant";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("automaweb-session");
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
