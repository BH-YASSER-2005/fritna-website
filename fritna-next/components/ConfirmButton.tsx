"use client";
export default function ConfirmButton({ children, msg }: { children: React.ReactNode; msg: string }) {
  return <button className="btn btn-o sm" onClick={(e) => { if (!confirm(msg)) e.preventDefault(); }}>{children}</button>;
}
