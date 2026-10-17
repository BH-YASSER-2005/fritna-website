import Link from "next/link";
import { requireAdmin } from "@/lib/supabase";
import { logout } from "./actions";
export const metadata = { title: "Fritna admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (<div className="adm"><aside className="aside"><span className="logo">Fritna admin</span>
    <Link href="/admin">Overview</Link><Link href="/admin/content/home">Homepage</Link><Link href="/admin/products">Products</Link>
    <Link href="/admin/content/company">Company</Link><Link href="/admin/content/seo">SEO</Link>
    <a href="/" target="_blank">View site</a>
    <form action={logout}><button type="submit">Log out</button></form></aside>
    <main className="amain">{children}</main></div>);
}
