import { specs } from '../data/content.js';

export default function Specs() {
  return (
    <section className="ag-specs" data-screen-label="Key-Specs">
      <div className="ag-specs-glow" aria-hidden="true" />
      <div className="ag-wrap ag-specs-grid">
        {specs.map((s, i) => (
          <div key={s.label} data-reveal={i * 60}>
            <div className="ag-spec-value">
              {s.value}
              {s.unit && <em className="ag-spec-unit">{s.unit}</em>}
            </div>
            <p className="ag-spec-label">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
