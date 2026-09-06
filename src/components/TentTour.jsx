import { useEffect, useRef } from 'react';
import Kicker from './Kicker.jsx';
import { tourStations } from '../data/content.js';

/**
 * Scroll-Rundgang durchs Grow-Zelt: eine vertikale Zeitleiste, deren Linie
 * sich beim Runterscrollen füllt (skalierter Fill-Layer, per rAF an die
 * Scrollposition gekoppelt) — ergänzt die bestehende [data-reveal]-Einblend-
 * Animation aus useReveal.js um ein Fortschrittsgefühl "durchs Zelt laufen".
 */
export default function TentTour() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      track.style.setProperty('--tour-progress', '1');
      return;
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = track.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        // Fortschritt 0 → Track-Anfang erreicht 85% der Viewport-Höhe von oben,
        // Fortschritt 1 → Track-Ende erreicht 40% der Viewport-Höhe von oben.
        const start = vh * 0.85;
        const end = vh * 0.4;
        const total = rect.height + (start - end);
        const passed = start - rect.top;
        const progress = Math.min(1, Math.max(0, total > 0 ? passed / total : 0));
        track.style.setProperty('--tour-progress', String(progress));
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="rundgang" className="ag-section ag-tour" data-screen-label="Rundgang">
      <div className="ag-wrap">
        <div className="ag-intro" data-reveal="0">
          <Kicker>Einmal durchs Zelt</Kicker>
          <h2 className="ag-h2">Ein Rundgang durch dein Grow-Zelt</h2>
          <p className="ag-body">
            Sechs Stationen, ein System: so spielt der Klimakontroller mit allem zusammen, was in
            deinem Zelt steht — von der Luft bis zum Topf.
          </p>
        </div>

        <div className="ag-tour-track" ref={trackRef}>
          <div className="ag-tour-line" aria-hidden="true">
            <div className="ag-tour-line-fill" />
          </div>

          {tourStations.map((s, i) => (
            <article key={s.title} className="ag-tour-station" data-reveal={i * 90}>
              <div className="ag-tour-dot">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {s.circle && <circle cx="12" cy="12" r="4" />}
                  {s.icon.map((d, k) => (
                    <path key={k} d={d} />
                  ))}
                </svg>
              </div>
              <div className="ag-tour-content">
                <div className="card-kicker">Station {i + 1}</div>
                <h3 className="ag-tour-title">{s.title}</h3>
                <p className="ag-tour-text">{s.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
