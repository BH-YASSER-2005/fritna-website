import { redirect } from "next/navigation";
import { sb } from "@/lib/supabase";
export const metadata = { title: "Fritna admin login", robots: { index: false } };
async function login(fd: FormData) {
  "use server";
  const s = await sb();
  const { error } = await s.auth.signInWithPassword({ email: String(fd.get("email") ?? ""), password: String(fd.get("password") ?? "") });
  if (error) redirect("/login?error=bad");
  redirect("/admin");
}
export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (<div className="login"><h1 style={{ fontSize: 32 }}>Fritna admin</h1>
    {error && <div className="msg bad" style={{ marginTop: 16 }}>{error === "denied" ? "This account is not an administrator." : "Email or password is incorrect."}</div>}
    <form action={login} style={{ display: "grid", gap: 14, padding: 24 }}>
      <div><label htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="email" /></div>
      <div><label htmlFor="pw">Password</label><input id="pw" name="password" type="password" required autoComplete="current-password" /></div>
      <button className="btn btn-d" type="submit">Sign in</button></form></div>);
}
