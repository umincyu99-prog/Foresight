import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/api", "/_next", "/favicon.ico"];
const LOCALES = ["ja", "en"] as const;
type Locale = (typeof LOCALES)[number];

function detectLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get("locale")?.value;
  if (cookie === "ja" || cookie === "en") return cookie;

  const acceptLang = req.headers.get("accept-language") ?? "";
  if (acceptLang.toLowerCase().includes("ja")) return "ja";
  return "en";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const hasLocale = LOCALES.some(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`
  );
  if (hasLocale) return NextResponse.next();

  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
