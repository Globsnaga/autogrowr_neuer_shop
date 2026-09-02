import { Link, useLocation, useParams } from 'react-router-dom';
import { formatMoney } from '../lib/medusa.js';

export default function OrderConfirmedPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const order = state?.order;

  return (
    <main id="top">
      <div className="ag-wrap ag-section">
        <div className="card elev-sm ag-form-card" style={{ maxWidth: 560 }} data-reveal="0">
          <div className="ag-sent">
            <h1 className="ag-sent-title">Danke für deine Bestellung!</h1>
            <p className="card-body">
              Bestellnummer <strong>{order?.display_id ? '#' + order.display_id : id}</strong>.
              Eine Bestätigung geht per E-Mail raus, sobald das Backend E-Mail-Versand
              konfiguriert hat (siehe MEDUSA_SETUP.md).
            </p>

            {order && (
              <>
                <div className="ag-rule" />
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, width: '100%' }}>
                  {(order.items || []).map((item) => (
                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                      <span>{item.quantity}× {item.product_title || item.title}</span>
                      <span>{formatMoney(item.total, order.currency_code)}</span>
                    </li>
                  ))}
                </ul>
                <div className="ag-cart-summary" style={{ width: '100%', fontSize: 17 }}>
                  <strong>Gesamt</strong>
                  <strong className="ag-price">{formatMoney(order.total, order.currency_code)}</strong>
                </div>
              </>
            )}

            <Link className="btn btn-secondary" to="/shop">Weiter einkaufen</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
