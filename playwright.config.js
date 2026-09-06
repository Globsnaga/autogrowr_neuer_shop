import { defineConfig, devices } from '@playwright/test';

/**
 * E2E-Konfiguration für den Autogrowr-Shop.
 *
 * Läuft standardmäßig gegen die echte Sandbox-Umgebung (Stripe Test-Mode),
 * da es (noch) keine separate Staging-Instanz gibt. Die Basis-URL lässt
 * sich per Umgebungsvariable überschreiben, z. B. für einen späteren
 * Staging-Server oder einen lokalen `vite preview`-Build.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['junit', { outputFile: 'playwright-report/results.xml' }], ['list']]
    : 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL || 'https://home.autogrowr.de',
    // Ohne explizite Locale startet Chromium in CI-Umgebungen oft mit
    // Englisch als Browsersprache. Stripe Elements rendert Feldnamen und
    // Platzhalter dann auf Englisch (locale: 'auto' folgt der Browsersprache),
    // wodurch der Test die deutschen Selektoren im Payment-iFrame nie findet.
    // de-DE hier stellt sicher, dass der Test dieselbe Sprache sieht wie
    // eure echten Kund:innen.
    locale: 'de-DE',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});
