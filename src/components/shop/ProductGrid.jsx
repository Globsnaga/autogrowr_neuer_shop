import { useEffect, useState } from 'react';
import { sdk } from '../../lib/medusa.js';
import { useCart } from '../../context/CartContext.jsx';
import ProductCard from './ProductCard.jsx';

export default function ProductGrid() {
  const { cart } = useCart();
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    sdk.store.product
      .list({
        limit: 24,
        region_id: cart?.region?.id,
        fields: '*variants.calculated_price,+variants.inventory_quantity,+thumbnail',
      })
      .then(({ products: list }) => {
        if (active) setProducts(list);
      })
      .catch((e) => {
        if (active) setError(e?.message || 'Produkte konnten nicht geladen werden.');
      });
    return () => {
      active = false;
    };
    // Erst laden, sobald der Cart (und damit die Region für Preise) bereitsteht.
  }, [cart?.region?.id]);

  if (error) {
    return (
      <p className="ag-error" role="alert">
        {error} Läuft das Medusa-Backend? Siehe MEDUSA_SETUP.md.
      </p>
    );
  }

  if (!products) {
    return <p className="text-muted">Produkte werden geladen …</p>;
  }

  if (!products.length) {
    return <p className="text-muted">Noch keine Produkte im Shop-Backend angelegt.</p>;
  }

  return (
    <div className="ag-product-grid">
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} revealDelay={i * 60} />
      ))}
    </div>
  );
}
