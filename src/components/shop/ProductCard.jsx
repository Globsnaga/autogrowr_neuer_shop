import { Link } from 'react-router-dom';
import { formatMoney } from '../../lib/medusa.js';

function cheapestPrice(product) {
  const amounts = (product.variants || [])
    .map((v) => v.calculated_price?.calculated_amount)
    .filter((a) => typeof a === 'number');
  if (!amounts.length) return null;
  return {
    amount: Math.min(...amounts),
    currency: product.variants[0]?.calculated_price?.currency_code || 'eur',
  };
}

export default function ProductCard({ product, revealDelay = 0 }) {
  const price = cheapestPrice(product);

  return (
    <Link
      to={'/shop/produkt/' + product.handle}
      className="card elev-sm ag-product"
      data-reveal={revealDelay}
    >
      <div className="ag-product-img">
        {product.thumbnail && <img src={product.thumbnail} alt={product.title} loading="lazy" />}
      </div>
      <div className="card-kicker">{product.collection?.title || 'Green Grower'}</div>
      <div className="card-title">{product.title}</div>
      <div className="ag-price">
        {price ? (product.variants.length > 1 ? 'ab ' : '') + formatMoney(price.amount, price.currency) : '—'}
      </div>
    </Link>
  );
}
