import { Outlet } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import CartDrawer from './components/shop/CartDrawer.jsx';
import useReveal from './hooks/useReveal.js';

/** Gemeinsamer Rahmen für Startseite und Shop: Nav, Footer, Cart-Drawer. */
export default function Layout() {
  useReveal();
  return (
    <>
      <a className="ag-skip" href="#top">Zum Inhalt springen</a>
      <Nav />
      <Outlet />
      <Footer />
      <CartDrawer />
    </>
  );
}
