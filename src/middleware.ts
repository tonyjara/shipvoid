import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { Account } from "next-auth";
import { appOptions } from "./lib/Constants/AppOptions";
import { env } from "./env.mjs";

export const WEB_URL = env.NEXT_PUBLIC_WEB_URL;

const redirect = (x: string) => NextResponse.redirect(WEB_URL + x);

export async function middleware(req: NextRequest) {
  const session = (await getToken({
    req,
    secret: env.NEXTAUTH_SECRET,
  })) as { user?: Account };

  const isAdmin = session?.user?.role === "admin";
  const isSupport = session?.user?.role === "support";
  const isDev = process.env.NODE_ENV === "development";

  if (
    (appOptions.heroScreenType === "comingSoon" && !isDev) ||
    (appOptions.heroScreenType === "maintenance" && !isDev) ||
    (appOptions.heroScreenType === "notifyMeWhenReady" && !isDev)
  ) {
    if (req.nextUrl.pathname.startsWith("/signup")) {
      if (!session) return redirect("/");
    }
  }

  if (req.nextUrl.pathname.startsWith("/home")) {
    if (!session || !isAdmin) return redirect("/");
  }

  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!isAdmin) return redirect("/home");
  }
  if (req.nextUrl.pathname.startsWith("/support")) {
    if (!isSupport && !isAdmin) return redirect("/home");
  }

  return;
}
