import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { sdk } from '../lib/medusa.js';

/**
 * Alle sdk.store.cart.*-Aufrufe hier folgen dem @medusajs/js-sdk-Muster
 * methode(cartId, payload, queryParams). Medusas Store-API entwickelt sich
 * zwischen Minor-Versionen weiter — falls nach dem Backend-Setup (siehe
 * MEDUSA_SETUP.md) Fehler zu genau einem dieser Aufrufe auftauchen, hilft ein
 * Blick in die "@medusajs/js-sdk"-Typdefinitionen der installierten Version
 * (node_modules/@medusajs/js-sdk), ob sich eine Signatur geändert hat.
 */

const CartContext = createContext(null);
const CART_ID_KEY = 'agr_cart_id';

const CART_FIELDS =
  '*items,*items.product,*items.variant,*region,*shipping_methods,*shipping_address,*billing_address';

/**
 * Hält genau einen aktiven Medusa-Warenkorb, gespiegelt in localStorage
 * (nur die Cart-ID, nicht die Inhalte — die kommen immer frisch vom Server).
 * Läuft unabhängig vom bestehenden Dünger-Shop auf shop.green-grower.de.
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const persistCartId = (id) => {
    try {
      if (id) window.localStorage.setItem(CART_ID_KEY, id);
      else window.localStorage.removeItem(CART_ID_KEY);
    } catch {
      // localStorage kann in privaten Fenstern o.ä. fehlen — Cart lebt dann nur in-memory
    }
  };

  const createCart = useCallback(async () => {
    const { regions } = await sdk.store.region.list();
    if (!regions?.length) {
      throw new Error(
        'Keine Region im Medusa-Backend gefunden. Im Admin unter Einstellungen → Regionen ' +
          'mindestens eine Region (z. B. Europa, EUR) anlegen.'
      );
    }
    const region = regions.find((r) => r.countries?.some((c) => c.iso_2 === 'de')) || regions[0];
    const { cart: created } = await sdk.store.cart.create({ region_id: region.id });
    persistCartId(created.id);
    return created;
  }, []);

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let id = null;
      try {
        id = window.localStorage.getItem(CART_ID_KEY);
      } catch {
        id = null;
      }

      if (id) {
        try {
          const { cart: existing } = await sdk.store.cart.retrieve(id, { fields: CART_FIELDS });
          setCart(existing);
          return;
        } catch {
          // Cart abgelaufen/gelöscht — neuen anlegen
          persistCartId(null);
        }
      }
      const created = await createCart();
      setCart(created);
    } catch (e) {
      setError(e?.message || 'Warenkorb konnte nicht geladen werden.');
    } finally {
      setLoading(false);
    }
  }, [createCart]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const withCart = useCallback(
    async (fn) => {
      if (!cart) return;
      setError('');
      try {
        const { cart: updated } = await fn(cart.id);
        setCart(updated);
        return updated;
      } catch (e) {
        setError(e?.message || 'Aktion fehlgeschlagen.');
        throw e;
      }
    },
    [cart]
  );

  const addItem = useCallback(
    (variantId, quantity = 1) =>
      withCart((cartId) =>
        sdk.store.cart.createLineItem(cartId, { variant_id: variantId, quantity }, { fields: CART_FIELDS })
      ),
    [withCart]
  );

  const updateItemQuantity = useCallback(
    (lineItemId, quantity) =>
      withCart((cartId) =>
        sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity }, { fields: CART_FIELDS })
      ),
    [withCart]
  );

  const removeItem = useCallback(
    (lineItemId) => withCart((cartId) => sdk.store.cart.deleteLineItem(cartId, lineItemId, { fields: CART_FIELDS })),
    [withCart]
  );

  const updateCart = useCallback(
    (payload) => withCart((cartId) => sdk.store.cart.update(cartId, payload, { fields: CART_FIELDS })),
    [withCart]
  );

  const addShippingMethod = useCallback(
    (optionId) =>
      withCart((cartId) =>
        sdk.store.cart.addShippingMethod(cartId, { option_id: optionId }, { fields: CART_FIELDS })
      ),
    [withCart]
  );

  /** Nach erfolgreichem Bezahlvorgang: Order abschließen und lokalen Cart löschen. */
  const completeCart = useCallback(async () => {
    if (!cart) throw new Error('Kein aktiver Warenkorb.');
    const result = await sdk.store.cart.complete(cart.id);
    if (result.type === 'order') {
      persistCartId(null);
      setCart(null);
      return result.order;
    }
    // type === 'cart' bedeutet: es gab ein Problem (z. B. Zahlung nicht autorisiert)
    throw new Error(result.error?.message || 'Bestellung konnte nicht abgeschlossen werden.');
  }, [cart]);

  const itemCount = useMemo(
    () => (cart?.items || []).reduce((sum, i) => sum + i.quantity, 0),
    [cart]
  );

  const value = useMemo(
    () => ({
      cart,
      loading,
      error,
      itemCount,
      addItem,
      updateItemQuantity,
      removeItem,
      updateCart,
      addShippingMethod,
      completeCart,
      reloadCart: loadCart,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      toggleDrawer: () => setDrawerOpen((v) => !v),
    }),
    [
      cart,
      loading,
      error,
      itemCount,
      addItem,
      updateItemQuantity,
      removeItem,
      updateCart,
      addShippingMethod,
      completeCart,
      loadCart,
      drawerOpen,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart() muss innerhalb von <CartProvider> verwendet werden.');
  return ctx;
}
