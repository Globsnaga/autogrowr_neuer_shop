import Figure from './Figure.jsx';
import { media } from '../data/media.js';

export default function Hero() {
  return (
    <section className="ag-hero" data-screen-label="Hero">
      <div id="ag-bloom" className="ag-bloom" aria-hidden="true" />
      <div className="ag-hero-fade" aria-hidden="true" />

      <div className="ag-wrap ag-hero-grid">
        <div data-reveal="0">
          <div className="ag-kicker">
            <span className="ag-kicker-rule" />
            <span style={{ color: 'var(--color-accent)' }}>Autogrowr GmbH · Made in Germany</span>
          </div>

          <h1 className="ag-h1">
            <span>KLIMA</span>
            <span className="ag-h1-row">
              KONTROLLER
              <em className="ag-year">2026</em>
            </span>
          </h1>

          <p className="ag-lead">
            Temperatur, Luftfeuchtigkeit, Beleuchtung und Luftzirkulation — intelligent gesteuert,
            in einem Gerät. Für die kleine Growbox genauso wie für das große Setup.
          </p>

          <div className="ag-cta-row">
            <a className="btn btn-primary ag-btn-lg" href="#kontakt">Händler werden</a>
            <a className="btn btn-secondary ag-btn-lg" href="#kontroller">Was er kann</a>
          </div>

          <div className="ag-tag-row">
            <span className="tag tag-neutral">Marktstart 2026</span>
            <span className="tag tag-neutral">App-Steuerung</span>
            <span className="tag tag-neutral">Entwickelt in Dernbach</span>
          </div>
        </div>

        <div id="ag-hero-art" className="ag-hero-art" data-reveal="120">
          <div className="ag-hero-glow" aria-hidden="true" />
          <Figure
            src={media.controller}
            alt="Green Grower Klimakontroller 2026"
            ratio="4 / 4.4"
            radius="14px"
            hint="Produktfoto Klimakontroller — am besten auf schwarzem Grund"
          />
        </div>
      </div>

      <div className="ag-scroll-hint" aria-hidden="true">
        <span>Scrollen</span>
        <span className="ag-scroll-line" />
      </div>
    </section>
  );
}
