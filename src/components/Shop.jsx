import Kicker from './Kicker.jsx';
import { products } from '../data/content.js';

export default function Shop() {
  return (
    <section id="sortiment" className="ag-section" data-screen-label="Sortiment">
      <div className="ag-wrap">
        <div className="ag-shop-head" data-reveal="0">
          <div className="ag-intro">
            <Kicker>Green Grower</Kicker>
            <h2 className="ag-h2">Nährstoffe für Grower und Social Clubs</h2>
            <p className="ag-body">
              Spezialdünger für Hobby-Grower, Kleingärtner und Social Clubs — entwickelt und
              vertrieben von der Autogrowr GmbH.
            </p>
          </div>
          <a className="btn btn-secondary ag-btn-lg" href="https://shop.green-grower.de/shop/" target="_blank" rel="noopener noreferrer">
            Zum Shop →
          </a>
        </div>

        <div className="ag-product-grid">
          {products.map((p, i) => (
            <a key={p.title} className="card elev-sm ag-product" href={p.href} target="_blank" rel="noopener noreferrer" data-reveal={i * 60}>
              <div className="ag-product-img" />
              <div className="card-kicker">{p.kicker}</div>
              <div className="card-title">{p.title}</div>
              <div className="ag-price">{p.price}</div>
            </a>
          ))}
        </div>

        <p className="ag-note" data-reveal="0">Kostenloser, diskreter Versand ab 50 €</p>
      </div>
    </section>
  );
}
