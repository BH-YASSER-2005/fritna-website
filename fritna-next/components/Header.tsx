"use client";
import { useState } from "react";
export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (<header><div className="wrap bar">
    <a className="logo" href="#top" aria-label="Fritna home">
      <svg viewBox="0 0 26 26" aria-hidden="true"><rect x="3" y="2" width="4" height="14" rx="1.5" fill="#2B1A10" transform="rotate(-8 5 9)" /><rect x="9" y="0" width="4" height="16" rx="1.5" fill="#2B1A10" /><rect x="15" y="2" width="4" height="14" rx="1.5" fill="#2B1A10" transform="rotate(8 17 9)" /><path d="M1 14h22l-3 11H4z" fill="#1F4A34" /></svg>Fritna</a>
    <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>Menu</button>
    <nav aria-label="Main"><ul id="nav" className={open ? "open" : ""} onClick={close}>
      <li><a href="#top">Home</a></li><li><a href="#products">Products</a></li><li><a href="#about">About us</a></li><li><a href="#quality">Quality</a></li><li><a href="#contact">Contact</a></li>
      <li><a className="btn btn-d" href="#contact">Request a quote</a></li></ul></nav>
  </div></header>);
}
