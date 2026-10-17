import Link from "next/link";
import { requireAdmin } from "@/lib/supabase";
import ConfirmButton from "@/components/ConfirmButton";
import { deleteProduct, moveProduct, togglePublished } from "../actions";
export default async function Products({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const q = await searchParams, s = await requireAdmin();
  const { data } = await s.from("products").select("*").order("sort_order").order("created_at");
  return (<><h1>Products</h1>{q.saved && <div className="msg">Saved.</div>}
    <div className="acts" style={{ margin: "0 0 14px" }}><Link className="btn btn-d" href="/admin/products/new">Add product</Link></div>
    {(data ?? []).map((p) => (<div className="prow" key={p.id}><span>{p.name}{p.is_sample ? " (sample)" : ""}</span><em className="pill">{p.published ? "Published" : "Draft"}</em>
      <form action={moveProduct.bind(null, p.id, -1)}><button className="btn btn-o sm" aria-label="Move up">↑</button></form>
      <form action={moveProduct.bind(null, p.id, 1)}><button className="btn btn-o sm" aria-label="Move down">↓</button></form>
      <Link className="btn btn-o sm" href={`/admin/products/${p.id}`}>Edit</Link>
      <form action={togglePublished.bind(null, p.id, !p.published)}><button className="btn btn-o sm">{p.published ? "Unpublish" : "Publish"}</button></form>
      <form action={deleteProduct.bind(null, p.id)}><ConfirmButton msg={`Delete “${p.name}”? This cannot be undone.`}>Delete</ConfirmButton></form></div>))}</>);
}
