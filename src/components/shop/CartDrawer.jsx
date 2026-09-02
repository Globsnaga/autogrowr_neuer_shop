import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext.jsx';
import { formatMoney } from '../../lib/medusa.js';

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, updateItemQuantity, removeItem, error } = useCart();

  if (!drawerOpen) return null;

  const items = cart?.items || [];

  return (
    <div className="ag-cart-overlay" role="dialog" aria-label="Warenkorb" aria-modal="true">
      <button className="ag-cart-scrim" aria-label="Warenkorb schließen" onClick={closeDrawer} />
      <div className="ag-cart-panel elev-lg">
        <div className="ag-cart-head">
          <h3 className="ag-sent-title">Warenkorb</h3>
          <button className="btn btn-secondary btn-icon" type="button" aria-label="Schließen" onClick={closeDrawer}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {error && <p className="ag-error" role="alert">{error}</p>}

        {items.length === 0 ? (
          <p className="text-muted">Noch keine Artikel im Warenkorb.</p>
        ) : (
          <ul className="ag-cart-list">
            {items.map((item) => (
              <li key={item.id} className="ag-cart-line">
                <div className="ag-cart-line-thumb">
                  {item.thumbnail && <img src={item.thumbnail} alt="" />}
                </div>
                <div className="ag-cart-line-info">
                  <div className="ag-cart-line-title">{item.product_title || item.title}</div>
                  {item.variant_title && <div className="ag-cart-line-variant">{item.variant_title}</div>}
                  <div className="ag-cart-qty">
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Menge verringern"
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      className="btn btn-secondary btn-icon"
                      onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      aria-label="Menge erhöhen"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost ag-cart-remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Entfernen
                    </button>
                  </div>
                </div>
                <div className="ag-price">{formatMoney(item.total, cart?.currency_code)}</div>
              </li>
            ))}
          </ul>
        )}

        <div className="ag-rule" />

        <div className="ag-cart-summary">
          <span>Zwischensumme</span>
          <span className="ag-price">{formatMoney(cart?.subtotal, cart?.currency_code)}</span>
        </div>
        <p className="ag-note" style={{ margin: '2px 0 0' }}>Versand und Steuern werden an der Kasse berechnet.</p>

        <Link
          to="/checkout"
          className="btn btn-primary btn-block ag-btn-lg"
          onClick={closeDrawer}
          aria-disabled={items.length === 0}
          style={items.length === 0 ? { pointerEvents: 'none', opacity: 0.45 } : undefined}
        >
          Zur Kasse
        </Link>
      </div>
    </div>
  );
}
