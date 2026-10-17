import { createClient } from "@supabase/supabase-js";
export type Content = Record<string, string>;
export type Product = { id: string; name: string; category: string | null; description: string | null; image_url: string | null; published: boolean; sort_order: number; is_sample: boolean };
export const DEFAULTS: Content = {
  headline: "Fries made for professional kitchens.",
  desc: "Fritna prepares and supplies French fries and potato products to restaurants, hotels and food service businesses that need a dependable partner behind the pass.",
  cta: "Explore products", ctaHref: "#products",
  aboutTitle: "A supplier built around the professional kitchen",
  aboutText: "Fritna is a company that prepares and supplies French fries and potato products. Our focus is on restaurants, hotels and food service professionals who rely on consistent product, service after service.",
  qualityText: "This section will describe how Fritna prepares its products. Only verified information will be published.",
  customersText: "Fritna serves businesses that prepare and serve food professionally.",
  seoTitle: "Fritna – French fries and potato products for professional kitchens",
  seoDesc: "Fritna prepares and supplies French fries and potato products to restaurants, hotels and food service businesses. Contact us for professional supply.",
};
const pub = () => createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false } });
export async function getContent(): Promise<Content> {
  const o = { ...DEFAULTS };
  try { const { data } = await pub().from("site_content").select("data").eq("id", 1).single();
    const d = (data?.data ?? {}) as Content; for (const k in d) if (d[k]) o[k] = d[k]; } catch {}
  return o;
}
export async function getProducts(): Promise<Product[]> {
  try { const { data } = await pub().from("products").select("*").eq("published", true).order("sort_order"); return (data ?? []) as Product[]; } catch { return []; }
}
