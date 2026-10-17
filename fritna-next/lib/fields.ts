export type Field = { key: string; label: string; type: "text" | "area" | "image" };
export const SECTIONS: Record<string, { title: string; fields: Field[] }> = {
  home: { title: "Homepage", fields: [
    { key: "headline", label: "Main headline", type: "text" }, { key: "desc", label: "Hero description", type: "area" },
    { key: "cta", label: "Main button text", type: "text" }, { key: "ctaHref", label: "Button destination (#section or https://…)", type: "text" },
    { key: "heroImg", label: "Hero image", type: "image" }, { key: "aboutTitle", label: "About title", type: "text" },
    { key: "aboutText", label: "About text", type: "area" }, { key: "qualityText", label: "Quality section text", type: "area" },
    { key: "customersText", label: "Customers section text", type: "area" }] },
  company: { title: "Company contact", fields: [
    { key: "phone", label: "Phone number", type: "text" }, { key: "email", label: "Email address", type: "text" },
    { key: "whatsapp", label: "WhatsApp number", type: "text" }, { key: "address", label: "Physical address", type: "text" }] },
  seo: { title: "SEO settings", fields: [
    { key: "seoTitle", label: "Website SEO title", type: "text" }, { key: "seoDesc", label: "Meta description", type: "area" },
    { key: "ogImage", label: "Social sharing image", type: "image" }] },
};
