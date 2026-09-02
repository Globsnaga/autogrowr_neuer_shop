# Klimakontroller-Shop — Backend einrichten (Medusa)

Dieser Shop läuft **komplett getrennt** vom bestehenden Dünger-Shop auf
shop.green-grower.de (WooCommerce). Nichts hier verändert den laufenden Shop —
es entsteht ein neues Backend für den `/shop`-Bereich auf autogrowr-website
(aktuell: Platzhalter für den Klimakontroller 2026, später beliebig
erweiterbar).

Das React-Frontend dafür ist bereits eingebaut (`src/pages/ShopHome.jsx`,
`ProductPage.jsx`, `CheckoutPage.jsx`, Cart-Drawer). Es fehlt nur noch das
Medusa-Backend, das die Produkt-, Warenkorb- und Bestelldaten liefert. Das
kann ich von hier aus nicht für dich einrichten — dafür braucht es einen
Server/eine Datenbank, die auf deinem Rechner laufen. Die folgenden Schritte
führst du einmal in deinem Terminal aus (z. B. das Terminal in PyCharm).

Voraussetzung: **Node.js 20+** und **Docker Desktop** (für die Datenbank —
alternativ eine gehostete Postgres-DB, z. B. [Neon](https://neon.tech), dann
Docker-Schritt weglassen und die Connection-URL von dort nehmen).

## 1. Backend-Projekt anlegen

Einen Ordner **neben** `autogrowr-website` anlegen, nicht darin:

```bash
cd "C:\Users\harzf\PycharmProjects\Autogrowr Website Projekt"
npx create-medusa-app@latest autogrowr-backend
```

Der Installer fragt einiges ab:
- **Datenbank**: erst mal überspringen/lokal lassen, wir setzen sie gleich manuell.
- **Next.js-Storefront installieren?** → **Nein** (wir haben schon ein eigenes
  React-Frontend in `autogrowr-website`).
- **Admin-User anlegen** → ja, E-Mail/Passwort merken.

## 2. Datenbank starten

```bash
docker run --name autogrowr-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d postgres:16
```

In `autogrowr-backend/.env` (Datei existiert schon nach Schritt 1):

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/autogrowr_medusa
STORE_CORS=http://localhost:5173
ADMIN_CORS=http://localhost:9000
AUTH_CORS=http://localhost:9000,http://localhost:5173
```

Dann Migrationen laufen lassen und Backend starten:

```bash
cd autogrowr-backend
npx medusa db:migrate
npm run dev
```

Backend läuft jetzt auf **http://localhost:9000**, Admin-Oberfläche auf
**http://localhost:9000/app** (dort mit dem Admin-User aus Schritt 1 einloggen).

## 3. Publishable API Key holen

Im Admin: **Settings → Publishable API Keys → Create**. Dem Key den
Standard-Sales-Channel zuordnen. Den Key kopieren.

In `autogrowr-website/.env` (Datei aus `.env.example` kopieren, falls noch
nicht vorhanden):

```
VITE_MEDUSA_BACKEND_URL=http://localhost:9000
VITE_MEDUSA_PUBLISHABLE_KEY=<der kopierte Key>
```

## 4. Region + Versand anlegen

Im Admin: **Settings → Regions → Create Region**
- Name: `Europa`, Währung: `EUR`, Länder: mindestens `Deutschland` (gerne auch
  Österreich, Schweiz falls relevant).

Dann **Settings → Locations → [Standort] → Shipping Options**: eine
Versandoption für die Region anlegen (z. B. „Standardversand“, Fixpreis
4,99 €). Ohne das bleibt der Checkout im Schritt „Versandart“ leer.

## 5. Stripe als Zahlungsanbieter einrichten

Im Backend-Ordner:

```bash
npm install @medusajs/payment-stripe
```

In `medusa-config.ts`, im `modules`-Array das Payment-Modul ergänzen (falls
dort schon ein `payment`-Eintrag existiert, den Provider in dessen
`providers`-Liste einfügen):

```ts
{
  resolve: '@medusajs/medusa/payment',
  options: {
    providers: [
      {
        resolve: '@medusajs/payment-stripe',
        id: 'stripe',
        options: {
          apiKey: process.env.STRIPE_API_KEY,
        },
      },
    ],
  },
},
```

In `autogrowr-backend/.env`:

```
STRIPE_API_KEY=sk_test_…
```

(Secret Key aus dem Stripe-Dashboard, Testmodus reicht zum Ausprobieren.)
Im Admin unter **Settings → Regions → Europa → Payment Providers** den
Stripe-Provider für die Region aktivieren.

In `autogrowr-website/.env`:

```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_…
```

(Publishable Key aus demselben Stripe-Konto.)

## 6. Produkte anlegen

Am zuverlässigsten über den Admin (**Products → Create**), nicht per Skript —
Skripte gegen die Medusa-Store-API brechen leicht bei Versionsunterschieden.
Fünf Minuten Klickarbeit pro Produkt. Zum Start reicht ein Platzhalter-Produkt:

| Feld | Wert |
|---|---|
| Titel | Green Grower Klimakontroller 2026 |
| Handle | `klimakontroller-2026` (wird meist automatisch vorgeschlagen) |
| Beschreibung | Temperatur, Luftfeuchtigkeit, Beleuchtung und Luftzirkulation intelligent gesteuert — in einem Gerät. |
| Vertriebskanal | der Standard-Sales-Channel (derselbe wie beim Publishable Key) |
| Variante | z. B. „Standard“, Preis nach eurer Kalkulation |
| Lagerbestand | „Kommt 2026“ → Lagerbestand auf 0 setzen oder Produkt als „Draft“ lassen, bis es lieferbar ist |

Weitere Varianten/Produkte (z. B. Zubehör) genauso anlegen — die Shop-Seite
(`/shop`) zeigt automatisch alles, was im Sales Channel des Publishable Keys
sichtbar ist.

## 7. Frontend verbinden

```bash
cd "C:\Users\harzf\PycharmProjects\Autogrowr Website Projekt\autogrowr-website"
npm install
copy .env.example .env      REM einmalig, dann die Werte aus Schritt 3+5 eintragen
npm run dev
```

`/shop` auf **http://localhost:5173/shop** öffnen — die angelegten Produkte
sollten erscheinen. Testkauf mit Stripes Testkarte **4242 4242 4242 4242**,
beliebiges zukünftiges Ablaufdatum, beliebige CVC.

## 8. Später: live schalten

Für den Betrieb braucht das Backend einen Server plus Postgres-Datenbank
(z. B. [Railway](https://railway.app) oder [Render](https://render.com) für
den Server, [Neon](https://neon.tech) für Postgres — beide haben kostenlose
Einstiegsstufen). Dann:
- `VITE_MEDUSA_BACKEND_URL` im Frontend auf die Live-URL des Backends setzen
- `STORE_CORS` im Backend um die Live-Domain der Website ergänzen
- Stripe-Keys auf die Live-Keys (`sk_live_…` / `pk_live_…`) umstellen, sobald
  echte Zahlungen laufen sollen

Das Frontend selbst (autogrowr-website) lässt sich unverändert z. B. auf
Vercel oder Netlify deployen, wie bisher geplant.

## Troubleshooting

- **„Keine Region im Medusa-Backend gefunden“** auf `/shop` → Schritt 4
  nachholen.
- **Produkte werden geladen, aber kein Preis** → Produkt hat keine Variante
  mit Preis in der Währung der Region, oder der Publishable Key ist nicht
  demselben Sales Channel zugeordnet wie das Produkt.
- **Zahlung schlägt fehl / kein `client_secret`** → Stripe-Provider ist nicht
  für die Region aktiviert (Schritt 5, letzter Absatz), oder `STRIPE_API_KEY`
  fehlt im Backend.
- **CORS-Fehler in der Browser-Konsole** → `STORE_CORS` in
  `autogrowr-backend/.env` prüfen, muss exakt `http://localhost:5173`
  enthalten (bzw. später die Live-Domain).
