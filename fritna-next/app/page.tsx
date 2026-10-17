import type { Metadata } from "next";
import { getContent, getProducts } from "@/lib/data";
import { Art, kindOf } from "@/components/Art";
import Header from "@/components/Header";
import ContactForm from "@/components/ContactForm";
export const revalidate = 60; // admin saves also call revalidatePath("/") so changes show immediately
export async function generateMetadata(): Promise<Metadata> {
  const c = await getContent();
  return { title: c.seoTitle, description: c.seoDesc,
    openGraph: { title: c.seoTitle, description: c.seoDesc, siteName: "Fritna", type: "website", images: c.ogImage ? [c.ogImage] : undefined },
    twitter: { card: "summary_large_image", title: c.seoTitle, description: c.seoDesc } };
}
const safeHref = (h: string) => (/^(#|https:\/\/)/.test(h) ? h : "#products");
function Val({ v, href, ph }: { v?: string; href?: string; ph: string }) {
  if (!v) return <>{ph}</>;
  return href ? <a href={href}>{v}</a> : <>{v}</>;
}
export default async function Home() {
  const [c, products] = await Promise.all([getContent(), getProducts()]);
  const tel = (c.phone ?? "").replace(/[^\d+]/g, ""), wa = (c.whatsapp ?? "").replace(/\D/g, "");
  const mail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email ?? "");
  return (<>
    <a className="skip" href="#main">Skip to content</a><Header />
    <main id="main">
      <div className="hero" id="top"><div className="wrap">
        <div><h1 className="on-gold">{c.headline}</h1><p>{c.desc}</p>
          <div className="cta"><a className="btn btn-d" href={safeHref(c.ctaHref)}>{c.cta}</a><a className="btn btn-o" href="#contact">Contact us</a></div></div>
        <div className="hero-art">{c.heroImg
          // eslint-disable-next-line @next/next/no-img-element
          ? <img src={c.heroImg} alt="Fritna hero" style={{ width: "100%", maxWidth: 520, borderRadius: 6, display: "block", margin: "auto" }} />
          : <Art kind="sticks" label="Illustration of golden French fries in a green carton" />}</div>
      </div></div>

      <section id="products"><div className="wrap">
        <div className="head"><h2>Our products</h2><p>A first look at the categories we supply. Illustrations are temporary and will be replaced with real product photography.</p></div>
        <div className="grid">{products.length === 0 ? <p>Products will be listed here soon.</p> : products.map((p) => (
          <article className="card" key={p.id}><div className="art">{p.image_url
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={p.image_url} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            : <Art kind={kindOf(p.name)} label={`Illustration of ${p.name}`} />}</div>
            <div className="body"><h3>{p.name}</h3><p>{p.description}</p>
              <span className="tbd">{p.is_sample ? "Sample content · " : ""}{p.category || "Uncategorised"}</span></div></article>))}</div>
      </div></section>

      <section id="about" className="alt"><div className="wrap split">
        <div className="panel"><Art kind="potatoes" label="Illustration of potatoes" /></div>
        <div><h2>{c.aboutTitle}</h2><p>{c.aboutText}</p>
          <p>We work business to business: our role is to make the potato side of your menu one less thing to worry about.</p>
          <div className="ph"><strong>Company history:</strong> founding story, team and milestones to be added once verified.</div></div>
      </div></section>

      <section id="customers"><div className="wrap">
        <div className="head"><h2>Who we supply</h2><p>{c.customersText}</p></div>
        <div className="cust">
          <div><h3>Restaurants</h3><p>Fries and potato sides for à la carte menus, from bistros to large dining rooms.</p></div>
          <div><h3>Hotels</h3><p>Potato products for room service, buffets, banquets and hotel restaurants.</p></div>
          <div><h3>Professional kitchens</h3><p>Central kitchens, caterers and canteens that cook for many people each day.</p></div>
          <div><h3>Other food service</h3><p>Snack bars, fast-casual concepts and other businesses selling potato dishes.</p></div>
        </div></div></section>

      <section id="quality" className="alt"><div className="wrap">
        <div className="head"><h2>Quality and preparation</h2><p>{c.qualityText}</p></div>
        <ol className="steps">
          <li><h3>Sourcing</h3><p>Potato selection and supplier details to be added.</p></li>
          <li><h3>Preparation</h3><p>Washing, cutting and processing steps to be added.</p></li>
          <li><h3>Quality control</h3><p>Checks and standards to be added.</p></li>
          <li><h3>Packing and delivery</h3><p>Packaging formats and delivery coverage to be added.</p></li>
        </ol>
        <div className="ph" style={{ marginTop: 28 }}><strong>Certifications:</strong> none are claimed on this site. Add verified certifications here when available.</div>
      </div></section>

      <section id="contact"><div className="wrap contact">
        <div><h2 style={{ fontSize: "clamp(32px,4.5vw,52px)" }}>Talk to Fritna</h2>
          <p style={{ marginTop: 16, color: "var(--mute)" }}>Tell us about your kitchen and what you need. Real contact details will replace the placeholders below.</p>
          <dl>
            <div><dt>Phone</dt><dd><Val v={c.phone} href={tel ? `tel:${tel}` : undefined} ph="[Phone number to be added]" /></dd></div>
            <div><dt>Email</dt><dd><Val v={c.email} href={mail ? `mailto:${c.email}` : undefined} ph="[Email address to be added]" /></dd></div>
            <div><dt>WhatsApp</dt><dd><Val v={c.whatsapp} href={wa ? `https://wa.me/${wa}` : undefined} ph="[WhatsApp number to be added]" /></dd></div>
            <div><dt>Address</dt><dd><Val v={c.address} ph="[Business address to be added]" /></dd></div>
          </dl></div>
        <ContactForm />
      </div></section>
    </main>
    <footer><div className="wrap">
      <div className="fgrid">
        <div><a className="logo" href="#top">Fritna</a><p style={{ marginTop: 12, fontSize: 15, maxWidth: "24em" }}>French fries and potato products for restaurants, hotels and food service businesses.</p></div>
        <div><h3>Navigate</h3><ul><li><a href="#products">Products</a></li><li><a href="#about">About us</a></li><li><a href="#customers">Customers</a></li><li><a href="#quality">Quality</a></li><li><a href="#contact">Contact</a></li></ul></div>
        <div><h3>Contact</h3><ul><li>{c.phone || "[Phone to be added]"}</li><li>{c.email || "[Email to be added]"}</li><li>{c.address || "[Address to be added]"}</li></ul></div>
        <div><h3>Social</h3><ul><li>[Facebook to be added]</li><li>[Instagram to be added]</li><li>[LinkedIn to be added]</li></ul></div>
      </div>
      <p className="small">© {new Date().getFullYear()} Fritna. All rights reserved.</p>
    </div></footer>
  </>);
}
