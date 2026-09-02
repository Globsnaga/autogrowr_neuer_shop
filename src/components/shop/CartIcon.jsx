import { useCart } from '../../context/CartContext.jsx';

export default function CartIcon() {
  const { itemCount, toggleDrawer } = useCart();

  return (
    <button
      className="btn btn-secondary btn-icon ag-cart-icon"
      type="button"
      aria-label={'Warenkorb öffnen' + (itemCount ? ', ' + itemCount + ' Artikel' : '')}
      onClick={toggleDrawer}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h2l1.6 10.2A2 2 0 0 0 9.6 18h8a2 2 0 0 0 2-1.7L21 8H7" />
        <circle cx="9.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="21" r="1.4" fill="currentColor" stroke="none" />
      </svg>
      {itemCount > 0 && <span className="ag-cart-badge">{itemCount}</span>}
    </button>
  );
}
