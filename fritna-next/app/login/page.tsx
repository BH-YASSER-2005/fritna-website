import { redirect } from "next/navigation";
import { sb } from "@/lib/supabase";
import { supabaseEnv } from "@/lib/env";
export const metadata = { title: "Fritna admin login", robots: { index: false } };
async function login(fd: FormData) {
  "use server";
  let ok = false;
  try {
    const s = await sb();
    const { error } = await s.auth.signInWithPassword({ email: String(fd.get("email") ?? ""), password: String(fd.get("password") ?? "") });
    ok = !error;
  } catch (e) { if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) throw e; redirect("/login?error=unavailable"); }
  redirect(ok ? "/admin" : "/login?error=bad");
}
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (<div className="login"><h1 style={{ fontSize: 32 }}>Fritna admin</h1>
    {(error || !supabaseEnv()) && <div className="msg bad" style={{ marginTop: 16 }}>{!supabaseEnv() || error === "config" ? "Supabase is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in Vercel, then redeploy." : error === "denied" ? "This account is not an administrator." : error === "unavailable" ? "Could not reach Supabase. Check the project URL and that the project is not paused." : error === "required" ? "Please sign in to continue." : "Email or password is incorrect."}</div>}
    <form action={login} style={{ display: "grid", gap: 14, padding: 24 }}>
      <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
      <div><label htmlFor="pw">Password</label><input id="pw" name="password" type="password" required autoComplete="current-password" /></div>
      <button className="btn btn-d" type="submit">Sign in</button></form></div>);
}
