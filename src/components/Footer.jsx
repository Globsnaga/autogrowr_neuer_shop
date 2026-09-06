import logo from '../assets/logo.png';
import { company } from '../data/content.js';

const groups = [
  {
    title: 'Produkt',
    links: [
      { href: '#kontroller', label: 'Klimakontroller' },
      { href: '#app', label: 'App' },
      { href: '#sortiment', label: 'Dünger' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { href: 'https://shop.green-grower.de/shop/', label: 'Green Grower Shop', ext: true },
      { href: 'https://shop.green-grower.de/green-grower-duengeschema/', label: 'Düngeschema', ext: true },
      { href: 'https://shop.green-grower.de/beitraege/', label: 'Beiträge', ext: true },
    ],
  },
  {
    title: 'Rechtliches',
    links: [
      { href: 'https://shop.green-grower.de/impressum/', label: 'Impressum', ext: true },
      { href: 'https://shop.green-grower.de/privacy-policy/', label: 'Datenschutz', ext: true },
      { href: 'https://shop.green-grower.de/kontakt/', label: 'Kontakt', ext: true },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="ag-footer">
      <div className="ag-wrap">
        <div className="ag-footer-grid">
          <div>
            <div className="ag-brand ag-brand-footer">
              <img src={logo} alt="Green Grower" />
              <span>AUTOGROWR</span>
            </div>
            <p className="ag-footer-blurb">
              Hardware und Nährstoffe für den Indoor-Anbau. Made in Germany.
            </p>
          </div>

          {groups.map((g) => (
            <nav key={g.title} className="ag-footer-col" aria-label={g.title}>
              <div className="ag-footer-title">{g.title}</div>
              {g.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.ext ? '_blank' : undefined}
                  rel={l.ext ? 'noopener noreferrer' : undefined}
                >
                  {l.label}
                </a>
              ))}
            </nav>
          ))}
        </div>

        <div className="ag-rule ag-rule-footer" />

        <div className="ag-legal">
          <span>{company.name} · {company.street} · {company.city}</span>
          <span>{company.email}</span>
          <span>USt-IdNr. {company.vatId}</span>
          <span>{company.register}</span>
          <span>Geschäftsführer: {company.directors}</span>
        </div>
      </div>
    </footer>
  );
}
