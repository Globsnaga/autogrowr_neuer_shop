import Kicker from './Kicker.jsx';
import { qualities } from '../data/content.js';

export default function Quality() {
  return (
    <section id="firma" className="ag-section" data-screen-label="Anspruch">
      <div className="ag-wrap">
        <div className="ag-intro" data-reveal="0">
          <Kicker>Qualität aus Deutschland</Kicker>
          <h2 className="ag-h2">Hochwertige Hardware, intuitive Software</h2>
          <p className="ag-body">
            Der Klimakontroller wird von der Autogrowr GmbH in Dernbach entwickelt. Unser Anspruch:
            eine Lösung, die im täglichen Einsatz zuverlässig funktioniert.
          </p>
        </div>

        <div className="ag-quality-grid">
          {qualities.map((q, i) => (
            <article key={q.n} className="card elev-sm ag-quality" data-reveal={i * 60}>
              <div className="card-kicker">{q.n}</div>
              <h3 className="card-title">{q.title}</h3>
              <p className="card-body">{q.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
