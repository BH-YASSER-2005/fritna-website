import { createServerClient } from "@supabase/ssr";
import type { CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseEnv } from "@/lib/env";

type C = { name: string; value: string; options: CookieOptions };
const toLogin = (req: NextRequest, why: string) => NextResponse.redirect(new URL(`/login?error=${why}`, req.url));

export async function middleware(req: NextRequest) {
  const isAdmin = req.nextUrl.pathname.startsWith("/admin");
  const env = supabaseEnv();
  // Fail closed: if Supabase is not configured we never let anyone into /admin, but we also never crash with a 500.
  if (!env) return isAdmin ? toLogin(req, "config") : NextResponse.next();
  try {
    let res = NextResponse.next({ request: req });
    const s = createServerClient(env.url, env.key, { cookies: { getAll: () => req.cookies.getAll(), setAll(l: C[]) {
      l.forEach(({ name, value }) => req.cookies.set(name, value));
      res = NextResponse.next({ request: req });
      l.forEach(({ name, value, options }) => res.cookies.set(name, value, options)); } } });
    const { data: { user } } = await s.auth.getUser();
    if (!user && isAdmin) return toLogin(req, "required");
    return res;
  } catch {
    return isAdmin ? toLogin(req, "unavailable") : NextResponse.next();
  }
}
export const config = { matcher: ["/admin/:path*", "/login"] };
