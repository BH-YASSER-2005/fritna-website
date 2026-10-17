/** Reads and validates the Supabase settings. Returns null (never throws) when they are missing or malformed. */
export function supabaseEnv(): { url: string; key: string } | null {
  const clean = (v?: string) => (v ?? "").trim().replace(/^["']|["']$/g, "");
  const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/+$/, "");
  // Preferred name is the newer "publishable" key; the older "anon" key name still works as a fallback.
  const key = clean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  try { if (!url || !key || !/^https?:$/.test(new URL(url).protocol)) return null; } catch { return null; }
  return { url, key };
}
