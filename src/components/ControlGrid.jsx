import { controls } from '../data/content.js';
import Kicker from './Kicker.jsx';

export default function ControlGrid() {
  return (
    <section id="kontroller" className="ag-section" data-screen-label="Steuert">
      <div className="ag-wrap">
        <div className="ag-section-head" data-reveal="0">
          <Kicker>Ein Gerät, fünf Stellschrauben</Kicker>
          <span className="ag-section-note">Überwachen. Steuern. Konstant halten.</span>
        </div>

        <div className="ag-control-grid">
          {controls.map((c, i) => (
            <article key={c.title} className="ag-control" data-reveal={i * 60}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.4" strokeLinecap="round">
                {c.circle && <circle cx="12" cy="12" r="4" />}
                {c.icon.split(' M').map((d, k) => (
                  <path key={k} d={k === 0 ? d : 'M' + d} />
                ))}
              </svg>
              <h3 className="ag-control-title">{c.title}</h3>
              <p className="ag-control-text">{c.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
