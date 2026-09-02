import { Routes, Route } from 'react-router-dom';
import Layout from './Layout.jsx';
import Home from './pages/Home.jsx';
import ShopHome from './pages/ShopHome.jsx';
import ProductPage from './pages/ProductPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import OrderConfirmedPage from './pages/OrderConfirmedPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ShopHome />} />
        <Route path="/shop/produkt/:handle" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/bestellung/:id" element={<OrderConfirmedPage />} />
      </Route>
    </Routes>
  );
}
