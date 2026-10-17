import Link from "next/link";
import { requireAdmin } from "@/lib/supabase";
import { saveProduct } from "../../actions";
export default async function Edit({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> }) {
  const { id } = await params, q = await searchParams, s = await requireAdmin();
  const { data: p } = id === "new" ? { data: null } : await s.from("products").select("*").eq("id", id).maybeSingle();
  return (<><h1>{p ? "Edit product" : "Add product"}</h1>{q.error && <div className="msg bad">{q.error}</div>}
    <form action={saveProduct} style={{ background: "none", border: 0, padding: 0 }}>
      <input type="hidden" name="id" value={p?.id ?? ""} />
      <div className="fld"><label htmlFor="name">Product name</label><input id="name" name="name" defaultValue={p?.name ?? ""} required maxLength={120} /></div>
      <div className="fld"><label htmlFor="category">Category</label><input id="category" name="category" defaultValue={p?.category ?? ""} /></div>
      <div className="fld"><label htmlFor="description">Description</label><textarea id="description" name="description" defaultValue={p?.description ?? ""} /></div>
      <div className="fld"><label htmlFor="image">Product image (JPEG, PNG or WebP, max 4 MB)</label>
        {/* eslint-disable-next-line @next/next/no-img-element */}{p?.image_url && <img src={p.image_url} alt="" />}<input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" /></div>
      <div className="fld"><label><input type="checkbox" name="published" defaultChecked={p?.published ?? false} style={{ width: "auto" }} /> Published on the website</label></div>
      <div className="acts"><button className="btn btn-d" type="submit">Save product</button><Link className="btn btn-o" href="/admin/products">Cancel</Link></div>
    </form></>);
}
