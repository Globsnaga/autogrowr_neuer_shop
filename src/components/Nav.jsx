import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import { navLinks } from '../data/content.js';
import CartIcon from './shop/CartIcon.jsx';

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header id="ag-nav" className="ag-nav" data-stuck="false">
      <div className="ag-nav-inner">
        <Link className="ag-brand" to="/" onClick={() => setOpen(false)}>
          <img src={logo} alt="Green Grower" />
          <span>AUTOGROWR</span>
        </Link>

        <nav className="ag-nav-links" aria-label="Hauptnavigation">
          {navLinks.map((l) => (
            <Link key={l.href} to={'/' + l.href}>{l.label}</Link>
          ))}
          <Link to="/shop">Shop</Link>
        </nav>

        <Link className="btn btn-primary ag-nav-cta" to="/#kontakt">Kontakt</Link>
        <CartIcon />

        <button
          className="btn btn-secondary btn-icon ag-burger"
          aria-expanded={open}
          aria-label="Menü öffnen"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="ag-nav-drawer" aria-label="Mobile Navigation">
          {navLinks.map((l) => (
            <Link key={l.href} to={'/' + l.href} onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Link to="/shop" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/#kontakt" onClick={() => setOpen(false)}>Kontakt</Link>
        </nav>
      )}

      <div className="ag-rule" />
    </header>
  );
}
