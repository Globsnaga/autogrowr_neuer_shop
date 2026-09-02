import Figure from './Figure.jsx';
import Kicker from './Kicker.jsx';
import { media } from '../data/media.js';

export default function Climate() {
  return (
    <section id="technik" className="ag-section" data-screen-label="Klima">
      <div className="ag-wrap ag-two">
        <div data-reveal="0">
          <Kicker>Klimasteuerung</Kicker>
          <h2 className="ag-h2">Ein Klima, das nicht schwankt</h2>
          <p className="ag-body">
            Ein stabiles Klima gehört zu den wichtigsten Faktoren für gesunde Pflanzen. Schon geringe
            Schwankungen bei Temperatur oder Luftfeuchtigkeit beeinflussen Wachstum und Entwicklung.
          </p>
          <p className="ag-body">
            Der Klimakontroller hält diese Werte konstant, betreibt den Growraum effizient — und nimmt
            dir den täglichen Aufwand ab.
          </p>
        </div>
        <div data-reveal="100">
          <Figure src={media.growbox} alt="Growbox von innen" ratio="5 / 4" hint="Growbox-Innenaufnahme, dunkel belichtet" />
        </div>
      </div>
    </section>
  );
}
