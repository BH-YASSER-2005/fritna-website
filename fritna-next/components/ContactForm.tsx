"use client";
import { useState } from "react";
// Demo form: no email service is connected, so nothing is sent (and it says so).
export default function ContactForm() {
  const [err, setErr] = useState<Record<string, string>>({});
  const [res, setRes] = useState("");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget), v = (k: string) => String(f.get(k) ?? "").trim();
    const x: Record<string, string> = {};
    if (!v("name")) x.name = "Enter your name."; if (!v("company")) x.company = "Enter your company name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) x.email = "Enter a valid email address, like name@company.com.";
    if (v("message").length < 10) x.message = "Write at least 10 characters.";
    setErr(x);
    setRes(Object.keys(x).length ? "Fix the highlighted fields and check again." : "Your details look valid, but nothing was sent. Connect an email service to deliver messages.");
  }
  const E = ({ k }: { k: string }) => <div className="err">{err[k]}</div>;
  return (<form onSubmit={submit} noValidate>
    <div className="notice">Demo form: this version has no email service connected, so messages are not sent.</div>
    <div className="row"><div><label htmlFor="n">Name</label><input id="n" name="name" autoComplete="name" /><E k="name" /></div>
      <div><label htmlFor="c">Company</label><input id="c" name="company" autoComplete="organization" /><E k="company" /></div></div>
    <div><label htmlFor="e">Email</label><input id="e" name="email" type="email" autoComplete="email" /><E k="email" /></div>
    <div><label htmlFor="m">Message</label><textarea id="m" name="message" /><E k="message" /></div>
    <button className="btn btn-d" type="submit">Check message</button>
    {res && <div className="notice" role="status">{res}</div>}
  </form>);
}
