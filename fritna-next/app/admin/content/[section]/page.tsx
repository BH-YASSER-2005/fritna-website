import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/supabase";
import { SECTIONS } from "@/lib/fields";
import { saveContent } from "../../actions";
export default async function Editor({ params, searchParams }: { params: Promise<{ section: string }>; searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { section } = await params, q = await searchParams, def = SECTIONS[section];
  if (!def) notFound();
  const s = await requireAdmin();
  const { data: row } = await s.from("site_content").select("data").eq("id", 1).single();
  const d = (row?.data ?? {}) as Record<string, string>;
  return (<><h1>{def.title}</h1>
    {q.saved && <div className="msg">Saved. The public site is updated.</div>}{q.error && <div className="msg bad">{q.error}</div>}
    <p style={{ color: "var(--mute)", marginBottom: 14 }}>Empty fields keep the default wording on the site.</p>
    <form action={saveContent.bind(null, section)} style={{ background: "none", border: 0, padding: 0 }}>
      {def.fields.map((f) => (<div className="fld" key={f.key}><label htmlFor={f.key}>{f.label}</label>
        {f.type === "area" ? <textarea id={f.key} name={f.key} defaultValue={d[f.key] ?? ""} />
          : f.type === "image" ? <>{/* eslint-disable-next-line @next/next/no-img-element */}{d[f.key] && <img src={d[f.key]} alt="" />}<input id={f.key} name={f.key} type="file" accept="image/jpeg,image/png,image/webp" /></>
          : <input id={f.key} name={f.key} defaultValue={d[f.key] ?? ""} />}</div>))}
      <div className="acts"><button className="btn btn-d" type="submit">Save and publish</button><a className="btn btn-o" href="/" target="_blank">Preview site</a></div>
    </form></>);
}
