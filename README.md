# Autogrowr GmbH — Website

Produkt- und Firmenwebsite für den **Green Grower Klimakontroller 2026**,
plus ein eigener Shop dafür unter `/shop`. Vite + React, dunkles
Nocturne-Design-System, Routing über react-router-dom.

Der bestehende Dünger-Shop (shop.green-grower.de, WooCommerce) läuft
unverändert weiter und wird von hier nur verlinkt (`src/components/Shop.jsx`,
Footer) — der neue `/shop`-Bereich ist ein eigenständiger Shop für den
Klimakontroller und künftiges Zubehör, mit eigenem Backend (Medusa).

## Starten

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Produktions-Build nach dist/
npm run preview  # den Build lokal ansehen
```

Voraussetzung: Node.js 18 oder neuer.

**Für `/shop`** wird zusätzlich ein Medusa-Backend gebraucht — Einrichtung
Schritt für Schritt in [`MEDUSA_SETUP.md`](./MEDUSA_SETUP.md). Ohne das
Backend läuft die Landingpage (`/`) normal, `/shop` zeigt dann eine
Fehlermeldung statt Produkten.

## Aufbau

```
src/
  main.jsx             Router, CartProvider, globale Styles
  App.jsx              Routen: "/" (Home), "/shop", "/shop/produkt/:handle",
                        "/checkout", "/bestellung/:id"
  Layout.jsx           Nav + Footer + Cart-Drawer, umschließt alle Routen
  pages/
    Home.jsx            bisherige Einseiten-Landingpage (Hero…Contact)
    ShopHome.jsx         Produktübersicht /shop
    ProductPage.jsx      Produktdetail + In-den-Warenkorb
    CheckoutPage.jsx     Adresse → Versand → Stripe-Zahlung
    OrderConfirmedPage.jsx Bestellbestätigung
  components/
    Nav.jsx            Sticky-Navigation + Mobile-Menü + Cart-Icon
    Hero.jsx           Titelbereich mit Produktbild
    Specs.jsx          Kennzahlen-Band
    ControlGrid.jsx    die fünf gesteuerten Klimafaktoren
    Climate.jsx        Klimasteuerung
    AppControl.jsx     App-Steuerung
    Quality.jsx        Made in Germany
    Shop.jsx           Green-Grower-Dünger (verlinkt weiter auf WooCommerce)
    Contact.jsx        Kontakt- und Händleranfrage
    Footer.jsx         Links, Impressumsdaten
    Figure.jsx         Bildfläche mit Platzhalter
    Kicker.jsx         die kleine Überschriftenmarke
    shop/
      ProductGrid.jsx    lädt Produkte vom Medusa-Backend
      ProductCard.jsx
      CartIcon.jsx       Icon in der Nav mit Artikel-Badge
      CartDrawer.jsx     Warenkorb-Panel
  context/
    CartContext.jsx    Warenkorb-State, spricht mit Medusa Store API
  lib/
    medusa.js          Medusa-SDK-Client + Preisformatierung
  data/
    content.js         SÄMTLICHE TEXTE UND LINKS der Landingpage — hier zuerst ändern
    media.js           Bildzuordnung
  styles/
    nocturne.css       Design-Tokens (Farben, Typo, Abstände)
    app.css            Layout, Bewegung, Responsive (Landingpage)
    shop.css           Cart-Drawer, Checkout — nutzt dieselben Tokens
  hooks/useReveal.js   Scroll-Einblendungen und Parallax (läuft pro Route neu)
```

## Texte ändern

Fast alles zur Landingpage steht in `src/data/content.js` — Firmendaten,
Navigation, Kennzahlen, Klimafaktoren, Qualitätsversprechen, Dünger-Produkte
(WooCommerce-Links), Kontaktthemen. Längere Fließtexte stehen direkt im
jeweiligen Abschnitt unter `src/components/`.

Die Produkte im **neuen** `/shop` (Klimakontroller & Zubehör) kommen dagegen
live aus dem Medusa-Backend, nicht aus `content.js` — siehe
`MEDUSA_SETUP.md`, Abschnitt „Produkte anlegen“.

## Bilder einfügen

1. Foto nach `src/assets/` legen
2. In `src/data/media.js` die passende `import`-Zeile entkommentieren
   und den `null`-Wert ersetzen

Ohne Bild zeigt die Seite einen dezenten Platzhalter — das Layout steht trotzdem.
Fotos auf schwarzem Grund wirken am besten: sie verschmelzen über
`mix-blend-mode: lighten` mit dem dunklen Hintergrund.

## Kontaktformular anbinden

`src/components/Contact.jsx`, Funktion `submit`. Aktuell wird der Versand nur
simuliert (Danke-Zustand). Dort einen `fetch`-Aufruf auf euer Backend, Formspree,
Netlify Forms o. ä. einsetzen.

## Farben ändern

Die `:root`-Variablen ganz oben in `src/styles/nocturne.css`. Alle Komponenten
(Landingpage **und** Shop) lesen daraus — eine Änderung dort färbt die ganze
Seite um.

## Rechtliches

Impressum und Datenschutz verlinken derzeit auf shop.green-grower.de. Für eine
eigenständige Autogrowr-Domain sollten beide Seiten eigene Unterseiten bekommen.
