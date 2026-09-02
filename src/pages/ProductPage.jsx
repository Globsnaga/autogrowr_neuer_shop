import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { sdk, formatMoney } from '../lib/medusa.js';
import { useCart } from '../context/CartContext.jsx';
import Figure from '../components/Figure.jsx';

function findMatchingVariant(product, selected) {
  if (!product?.variants) return null;
  return (
    product.variants.find((variant) =>
      (variant.options || []).every((opt) => selected[opt.option_id] === opt.value)
    ) || null
  );
}

export default function ProductPage() {
  const { handle } = useParams();
  const navigate = useNavigate();
  const { cart, addItem, openDrawer } = useCart();

  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState('');

  useEffect(() => {
    let active = true;
    setProduct(null);
    setError('');
    sdk.store.product
      .list({
        handle,
        region_id: cart?.region?.id,
        fields: '*variants.calculated_price,*options,*variants.options,+thumbnail,+description',
      })
      .then(({ products }) => {
        if (!active) return;
        const found = products?.[0];
        if (!found) {
          setError('Produkt nicht gefunden.');
          return;
        }
        setProduct(found);
        // Erste Variante als Vorauswahl setzen
        const first = found.variants?.[0];
        if (first) {
          const initial = {};
          (first.options || []).forEach((o) => {
            initial[o.option_id] = o.value;
          });
          setSelected(initial);
        }
      })
      .catch((e) => {
        if (active) setError(e?.message || 'Produkt konnte nicht geladen werden.');
      });
    return () => {
      active = false;
    };
  }, [handle, cart?.region?.id]);

  const variant = useMemo(() => findMatchingVariant(product, selected), [product, selected]);
  const price = variant?.calculated_price;

  async function handleAdd() {
    if (!variant) return;
    setAdding(true);
    setAddError('');
    try {
      await addItem(variant.id, quantity);
      openDrawer();
    } catch (e) {
      setAddError(e?.message || 'Konnte nicht zum Warenkorb hinzugefügt werden.');
    } finally {
      setAdding(false);
    }
  }

  if (error) {
    return (
      <main id="top">
        <div className="ag-wrap ag-section">
          <p className="ag-error" role="alert">{error}</p>
          <Link className="btn btn-secondary" to="/shop">← Zurück zum Shop</Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main id="top">
        <div className="ag-wrap ag-section"><p className="text-muted">Produkt wird geladen …</p></div>
      </main>
    );
  }

  return (
    <main id="top">
      <div className="ag-wrap ag-section ag-two" style={{ alignItems: 'start' }}>
        <Figure
          src={product.thumbnail}
          alt={product.title}
          ratio="1 / 1"
          radius="var(--radius-lg)"
          hint="Kein Produktfoto hinterlegt"
        />

        <div data-reveal="0">
          <button className="btn btn-ghost" type="button" onClick={() => navigate('/shop')} style={{ marginBottom: 18, paddingLeft: 0 }}>
            ← Zurück zum Shop
          </button>
          <h1 className="ag-h2">{product.title}</h1>
          <p className="ag-body" style={{ whiteSpace: 'pre-line' }}>{product.description}</p>

          <div className="ag-price" style={{ fontSize: 22, margin: '4px 0 22px' }}>
            {price ? formatMoney(price.calculated_amount, price.currency_code) : '—'}
          </div>

          {(product.options || []).map((option) => (
            <div className="field" key={option.id} style={{ marginBottom: 14, maxWidth: 320 }}>
              <label htmlFor={'opt-' + option.id}>{option.title}</label>
              <select
                className="input"
                id={'opt-' + option.id}
                value={selected[option.id] || ''}
                onChange={(e) => setSelected((s) => ({ ...s, [option.id]: e.target.value }))}
              >
                {option.values.map((v) => (
                  <option key={v.value} value={v.value}>{v.value}</option>
                ))}
              </select>
            </div>
          ))}

          <div className="ag-cart-qty" style={{ margin: '0 0 18px' }}>
            <button type="button" className="btn btn-secondary btn-icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Menge verringern">−</button>
            <span>{quantity}</span>
            <button type="button" className="btn btn-secondary btn-icon" onClick={() => setQuantity((q) => q + 1)} aria-label="Menge erhöhen">+</button>
          </div>

          {addError && <p className="ag-error" role="alert">{addError}</p>}

          <button
            className="btn btn-primary ag-btn-lg"
            type="button"
            disabled={!variant || adding}
            onClick={handleAdd}
          >
            {adding ? 'Wird hinzugefügt …' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
    </main>
  );
}
