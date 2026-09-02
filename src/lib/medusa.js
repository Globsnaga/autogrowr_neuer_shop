/**
 * Medusa-Client für den Klimakontroller-Shop.
 *
 * Läuft komplett getrennt vom bestehenden WooCommerce-Dünger-Shop
 * (shop.green-grower.de) — dieser Client spricht nur mit dem neuen
 * Medusa-Backend, das über MEDUSA_SETUP.md eingerichtet wird.
 *
 * Nötige Variablen in .env (siehe .env.example):
 *   VITE_MEDUSA_BACKEND_URL       z. B. http://localhost:9000
 *   VITE_MEDUSA_PUBLISHABLE_KEY   Store-API-Key aus dem Medusa-Admin
 */
import Medusa from '@medusajs/js-sdk';

const baseUrl = import.meta.env.VITE_MEDUSA_BACKEND_URL || 'http://localhost:9000';
const publishableKey = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY || '';

if (import.meta.env.DEV && !publishableKey) {
  // eslint-disable-next-line no-console
  console.warn(
    '[shop] VITE_MEDUSA_PUBLISHABLE_KEY fehlt — Store-API-Aufrufe schlagen fehl, ' +
      'bis der Key aus dem Medusa-Admin in .env eingetragen ist (siehe MEDUSA_SETUP.md).'
  );
}

export const sdk = new Medusa({
  baseUrl,
  publishableKey,
  debug: import.meta.env.DEV,
});

/** Formatiert einen Medusa-Geldbetrag (bereits in Haupteinheit, nicht Cent) als €-Preis. */
export function formatMoney(amount, currencyCode = 'eur') {
  if (amount == null) return '';
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: currencyCode.toUpperCase(),
  }).format(amount);
}
