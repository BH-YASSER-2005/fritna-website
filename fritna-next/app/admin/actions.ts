"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin, sb } from "@/lib/supabase";
import { SECTIONS } from "@/lib/fields";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };
const MAX = 4 * 1024 * 1024; // Vercel Hobby limits request bodies to ~4.5 MB
type DB = Awaited<ReturnType<typeof requireAdmin>>;

async function upload(s: DB, f: FormDataEntryValue | null): Promise<string | null> {
  if (!(f instanceof File) || f.size === 0) return null;
  if (!TYPES[f.type]) throw new Error("Use a JPEG, PNG or WebP image.");
  if (f.size > MAX) throw new Error("Image must be under 4 MB.");
  const path = `${crypto.randomUUID()}.${TYPES[f.type]}`;
  const { error } = await s.storage.from("media").upload(path, f, { contentType: f.type });
  if (error) throw new Error("Upload failed: " + error.message);
  return s.storage.from("media").getPublicUrl(path).data.publicUrl;
}
const refresh = () => { revalidatePath("/"); revalidatePath("/admin", "layout"); };

export async function saveContent(section: string, fd: FormData) {
  const s = await requireAdmin();
  const def = SECTIONS[section]; if (!def) redirect("/admin");
  let err = "";
  try {
    const { data: row } = await s.from("site_content").select("data").eq("id", 1).single();
    const data: Record<string, string> = { ...((row?.data as Record<string, string>) ?? {}) };
    for (const f of def.fields) {
      if (f.type === "image") { const u = await upload(s, fd.get(f.key)); if (u) data[f.key] = u; continue; }
      const v = String(fd.get(f.key) ?? "").trim().slice(0, 2000);
      if (f.key === "ctaHref" && v && !/^(#|https:\/\/)/.test(v)) throw new Error("Button destination must start with # or https://");
      if (f.key === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new Error("Enter a valid email address.");
      data[f.key] = v;
    }
    const { error } = await s.from("site_content").upsert({ id: 1, data, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
  } catch (e) { err = (e as Error).message; }
  if (err) redirect(`/admin/content/${section}?error=${encodeURIComponent(err)}`);
  refresh(); redirect(`/admin/content/${section}?saved=1`);
}

export async function saveProduct(fd: FormData) {
  const s = await requireAdmin();
  const id = String(fd.get("id") ?? ""), name = String(fd.get("name") ?? "").trim();
  let err = "";
  try {
    if (!name || name.length > 120) throw new Error("Enter a product name (up to 120 characters).");
    const row: Record<string, unknown> = { name, category: String(fd.get("category") ?? "").trim().slice(0, 80),
      description: String(fd.get("description") ?? "").trim().slice(0, 1000), published: fd.get("published") === "on" };
    const img = await upload(s, fd.get("image")); if (img) row.image_url = img;
    if (id) { const { error } = await s.from("products").update(row).eq("id", id); if (error) throw new Error(error.message); }
    else { const { count } = await s.from("products").select("*", { count: "exact", head: true });
      const { error } = await s.from("products").insert({ ...row, sort_order: count ?? 0 }); if (error) throw new Error(error.message); }
  } catch (e) { err = (e as Error).message; }
  if (err) redirect(`/admin/products/${id || "new"}?error=${encodeURIComponent(err)}`);
  refresh(); redirect("/admin/products?saved=1");
}
export async function togglePublished(id: string, to: boolean) { const s = await requireAdmin(); await s.from("products").update({ published: to }).eq("id", id); refresh(); redirect("/admin/products"); }
export async function deleteProduct(id: string) { const s = await requireAdmin(); await s.from("products").delete().eq("id", id); refresh(); redirect("/admin/products?saved=1"); }
export async function moveProduct(id: string, dir: number) {
  const s = await requireAdmin();
  const { data } = await s.from("products").select("id").order("sort_order").order("created_at");
  const ids = (data ?? []).map((r) => r.id as string), i = ids.indexOf(id), j = i + dir;
  if (i >= 0 && j >= 0 && j < ids.length) { [ids[i], ids[j]] = [ids[j], ids[i]]; await Promise.all(ids.map((x, k) => s.from("products").update({ sort_order: k }).eq("id", x))); }
  refresh(); redirect("/admin/products");
}
export async function logout() { const s = await sb(); await s.auth.signOut(); redirect("/"); }
