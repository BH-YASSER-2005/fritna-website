export type Kind = "sticks" | "wedges" | "potatoes";
export function Art({ kind, label }: { kind: Kind; label: string }) {
  return (<svg viewBox="0 0 400 400" role="img" aria-label={label}>
    <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#FBD774" /><stop offset="1" stopColor="#E39B1B" /></linearGradient></defs>
    {kind === "sticks" && <>{[150, 190, 120, 210, 160, 200, 140, 180, 130].map((h, i) => { const x = 100 + i * 23; return <rect key={i} x={x} y={250 - h} width={20} height={h + 40} rx={4} fill="url(#fg)" stroke="#B9780F" strokeWidth={1} transform={`rotate(${(i - 4) * 5} ${x + 10} 260)`} />; })}
      <path d="M95 230h210l-26 150H121z" fill="#1F4A34" /><path d="M95 230h210l-4 24H99z" fill="#000" fillOpacity={0.18} />
      <text x="200" y="326" textAnchor="middle" fontSize="40" fontWeight="800" fontFamily="Bricolage Grotesque,Arial,sans-serif" fill="#F4B63F">Fritna</text></>}
    {kind === "wedges" && <>{[0, 1, 2, 3, 4].map((i) => { const x = 90 + i * 50, y = 110 + (i % 2) * 30; return <path key={i} d={`M${x} ${y + 150}Q${x + 30} ${y} ${x + 60} ${y + 150}Z`} fill="url(#fg)" stroke="#B9780F" strokeWidth={2} transform={`rotate(${(i - 2) * 10} ${x + 30} ${y + 150})`} />; })}</>}
    {kind === "potatoes" && <>{[[150, 210, 95, 70, -12], [250, 230, 80, 60, 10], [205, 150, 70, 52, 4]].map(([cx, cy, rx, ry, r], i) => <g key={i}><ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#B98B5B" transform={`rotate(${r} ${cx} ${cy})`} /><circle cx={cx - 20} cy={cy - 10} r={3} fill="#7A5632" /><circle cx={cx + 18} cy={cy + 12} r={3} fill="#7A5632" /></g>)}</>}
  </svg>);
}
export const kindOf = (n: string): Kind => (/wedge/i.test(n) ? "wedges" : /fr(y|ies)/i.test(n) ? "sticks" : "potatoes");
