import { test, expect } from '@playwright/test';

/**
 * End-to-End-Test für den kompletten Kaufvorgang: Produkt -> Warenkorb ->
 * Adresse -> Versand -> Stripe-Zahlung (Test-Mode) -> Bestellbestätigung.
 *
 * WICHTIG: Dieser Test läuft (mangels eigener Staging-Umgebung) gegen die
 * echte Sandbox-Instanz unter home.autogrowr.de. Stripe steht dort im
 * Test-Modus, es wird also kein echtes Geld bewegt — aber jeder Lauf legt
 * eine reale Bestellung im Medusa-Admin an und löst die Bestell-/Owner-
 * Benachrichtigungsmail aus. Deshalb:
 *   - läuft dieser Test in der Pipeline standardmäßig nicht bei jedem Push,
 *     sondern nur auf dem "main"-Branch bzw. per Zeitplan (siehe Jenkinsfile),
 *   - verwendet er eine eindeutig als Test erkennbare E-Mail-Adresse,
 *   - sollten Testbestellungen im Medusa-Admin gelegentlich manuell
 *     aufgeräumt werden.
 *
 * Sobald es eine echte Staging-Umgebung mit eigener DB gibt, sollte
 * E2E_BASE_URL in der Pipeline darauf umgestellt werden.
 */

const PRODUCT_HANDLE = 'maxi-set';
const STRIPE_TEST_CARD = '4242424242424242';

test('kompletter Checkout mit Stripe-Testkarte', async ({ page }) => {
  const runId = Date.now();
  const testEmail = `ci-e2e+${runId}@autogrowr.de`;

  // 1. Produktseite öffnen und in den Warenkorb legen
  await page.goto(`/shop/produkt/${PRODUCT_HANDLE}`);
  await expect(page.getByRole('heading', { name: 'Maxi Set' })).toBeVisible();
  await page.getByRole('button', { name: 'In den Warenkorb' }).click();

  // 2. Warenkorb-Drawer öffnet automatisch -> zur Kasse
  await page.getByRole('link', { name: 'Zur Kasse' }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  // 3. Adresse ausfüllen
  await page.getByLabel('E-Mail').fill(testEmail);
  await page.getByLabel('Vorname').fill('CI');
  await page.getByLabel('Nachname').fill('Testlauf');
  await page.getByLabel('Straße und Hausnummer').fill('Teststraße 1');
  await page.getByLabel('PLZ').fill('56307');
  await page.getByLabel('Stadt').fill('Dernbach');
  await page.getByRole('button', { name: 'Weiter zum Versand' }).click();

  // 4. Versandart wählen (erste verfügbare Option reicht für den Test)
  await expect(page.getByRole('heading', { name: 'Versandart' })).toBeVisible();
  await page.locator('input[type="radio"][name="shipping"]').first().check();
  await page.getByRole('button', { name: 'Weiter zur Zahlung' }).click();

  // 5. Stripe Payment Element befüllen (Testkarte, immer erfolgreich)
  const stripeFrame = page.frameLocator('iframe[title="Sicherer Eingaberahmen für Zahlungen"]').first();
  await stripeFrame.getByPlaceholder('1234 1234 1234 1234').fill(STRIPE_TEST_CARD);
  await stripeFrame.getByPlaceholder('MM/JJ').fill('12/34');
  await stripeFrame.getByPlaceholder('Prüfziffer').fill('123');

  // 6. Bestellung abschließen
  await page.getByRole('button', { name: 'Jetzt kostenpflichtig bestellen' }).click();

  // 7. Bestätigungsseite prüfen
  await expect(page).toHaveURL(/\/bestellung\//, { timeout: 30_000 });
  await expect(page.getByRole('heading', { name: 'Danke für deine Bestellung!' })).toBeVisible();
  await expect(page.getByText('Maxi Set')).toBeVisible();
});
