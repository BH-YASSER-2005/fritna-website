import Link from "next/link";
import { requireAdmin } from "@/lib/supabase";
export default async function Overview() {
  const s = await requireAdmin();
  const { data } = await s.from("products").select("published");
  const pub = (data ?? []).filter((p) => p.published).length;
  return (<><h1>Overview</h1>
    <div className="stats"><div className="stat"><b>{pub}</b>Published products</div><div className="stat"><b>{(data ?? []).length - pub}</b>Draft products</div><div className="stat"><b>6</b>Website sections</div></div>
    <div className="acts"><Link className="btn btn-d" href="/admin/content/home">Edit homepage</Link><Link className="btn btn-o" href="/admin/products">Manage products</Link></div></>);
}
