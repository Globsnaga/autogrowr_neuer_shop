export default function Kicker({ children, tone }) {
  const color = tone === 'light' ? 'var(--color-accent-300)' : 'var(--color-accent)';
  return (
    <div className="ag-kicker">
      <span className="ag-kicker-rule" style={{ background: color }} />
      <span style={{ color }}>{children}</span>
    </div>
  );
}
