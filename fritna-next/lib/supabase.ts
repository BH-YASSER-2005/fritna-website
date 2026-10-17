import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import { redirect } from "next/navigation";
type C = { name: string; value: string; options: CookieOptions };
export async function sb() {
  const c = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: { getAll: () => c.getAll(), setAll(l: C[]) { try { l.forEach(({ name, value, options }) => c.set(name, value, options)); } catch {} } } });
}
/** Used by every admin page and every admin action. RLS in the database enforces the same rule again. */
export async function requireAdmin() {
  const s = await sb();
  const { data: { user } } = await s.auth.getUser();
  if (!user) redirect("/login");
  const { data } = await s.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!data) { await s.auth.signOut(); redirect("/login?error=denied"); }
  return s;
}
