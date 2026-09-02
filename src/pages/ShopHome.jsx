import Kicker from '../components/Kicker.jsx';
import ProductGrid from '../components/shop/ProductGrid.jsx';

export default function ShopHome() {
  return (
    <main id="top">
      <section className="ag-section" style={{ paddingBottom: 0 }} data-screen-label="Shop">
        <div className="ag-wrap">
          <div className="ag-shop-head" data-reveal="0">
            <div className="ag-intro">
              <Kicker>Klimakontroller 2026</Kicker>
              <h2 className="ag-h2">Shop</h2>
              <p className="ag-body">
                Der Green Grower Klimakontroller und passendes Zubehör — direkt bei der
                Autogrowr GmbH bestellt, Versand aus Deutschland.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ag-section" style={{ paddingTop: 0 }}>
        <div className="ag-wrap">
          <ProductGrid />
        </div>
      </section>
    </main>
  );
}
