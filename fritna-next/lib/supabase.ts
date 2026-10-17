import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { supabaseEnv } from "@/lib/env";
type C = { name: string; value: string; options: CookieOptions };
export async function sb() {
  const env = supabaseEnv();
  if (!env) redirect("/login?error=config");
  const c = await cookies();
  return createServerClient(env.url, env.key, {
    cookies: { getAll: () => c.getAll(), setAll(l: C[]) { try { l.forEach(({ name, value, options }) => c.set(name, value, options)); } catch {} } } });
}
/** Used by every admin page and every admin action. RLS in the database enforces the same rule again. */
export async function requireAdmin() {
  const s = await sb();
  let user = null, data = null;
  try {
    user = (await s.auth.getUser()).data.user;
    if (user) data = (await s.from("admins").select("user_id").eq("user_id", user.id).maybeSingle()).data;
  } catch { redirect("/login?error=unavailable"); }
  if (!user) redirect("/login");
  if (!data) { await s.auth.signOut(); redirect("/login?error=denied"); }
  return s;
}
