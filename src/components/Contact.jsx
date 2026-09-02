import { useState } from 'react';
import Kicker from './Kicker.jsx';
import { company, contactTopics, interests } from '../data/content.js';

const empty = { topic: 'Händler werden', firma: '', name: '', email: '', interesse: interests[0], nachricht: '' };

export default function Contact() {
  const [form, setForm] = useState(empty);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const isDealer = form.topic === 'Händler werden';

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !/.+@.+\..+/.test(form.email)) {
      setError('Bitte Name und eine gültige E-Mail-Adresse angeben.');
      return;
    }
    setError('');
    // TODO: Hier den echten Versand anbinden (eigenes Backend, Formspree,
    // Netlify Forms o. ae.). Aktuell wird die Anfrage nur simuliert.
    setSent(true);
  }

  return (
    <section id="kontakt" className="ag-contact" data-screen-label="Kontakt">
      <div className="ag-contact-glow" aria-hidden="true" />
      <div className="ag-wrap ag-two ag-contact-grid">
        <div data-reveal="0">
          <Kicker tone="light">Kontakt</Kicker>
          <h2 className="ag-h2">Sprich uns an</h2>
          <p className="ag-body">
            Du hast einen Grow Shop und möchtest offizieller Green Grower Händler werden? Oder du
            vermisst ein Produkt und hast Anmerkungen? Schreib uns — unverbindlich.
          </p>

          <dl className="ag-contact-details">
            <div>
              <dt>Anschrift</dt>
              <dd>{company.name}<br />{company.street}<br />{company.city}</dd>
            </div>
            <div>
              <dt>E-Mail</dt>
              <dd><a href={'mailto:' + company.email}>{company.email}</a></dd>
            </div>
            <div>
              <dt>Unterlagen</dt>
              <dd>
                <a href="https://shop.green-grower.de/wp-content/uploads/2026/04/Green-Grower-Businesspraesentation.pdf" target="_blank" rel="noopener noreferrer">
                  ↓ Businesspräsentation (PDF)
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="card elev-sm ag-form-card" data-reveal="80">
          {sent ? (
            <div className="ag-sent">
              <h3 className="ag-sent-title">Vielen Dank für deine Nachricht.</h3>
              <p className="card-body">Wir melden uns in der Regel innerhalb von zwei Werktagen.</p>
              <button className="btn btn-secondary" type="button" onClick={() => { setForm(empty); setSent(false); }}>
                Neue Anfrage
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className="field">
                <label htmlFor="topic">Anliegen</label>
                <div className="seg" id="topic">
                  {contactTopics.map((t) => (
                    <label key={t} className="seg-opt">
                      <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set('topic')} />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              {isDealer && (
                <div className="field">
                  <label htmlFor="firma">Firma / Club</label>
                  <input className="input" id="firma" type="text" value={form.firma} onChange={set('firma')} placeholder="Name deines Shops" />
                </div>
              )}

              <div className="ag-field-row">
                <div className="field">
                  <label htmlFor="name">Name</label>
                  <input className="input" id="name" type="text" value={form.name} onChange={set('name')} placeholder="Vor- und Nachname" required />
                </div>
                <div className="field">
                  <label htmlFor="email">E-Mail</label>
                  <input className="input" id="email" type="email" value={form.email} onChange={set('email')} placeholder="kontakt@growshop.de" required />
                </div>
              </div>

              {isDealer && (
                <div className="field">
                  <label htmlFor="interesse">Ich interessiere mich für</label>
                  <select className="input" id="interesse" value={form.interesse} onChange={set('interesse')}>
                    {interests.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
              )}

              <div className="field">
                <label htmlFor="nachricht">Deine Nachricht</label>
                <textarea className="input" id="nachricht" value={form.nachricht} onChange={set('nachricht')} placeholder="Worum geht es?" />
              </div>

              {error && <p className="ag-error" role="alert">{error}</p>}

              <button className="btn btn-primary btn-block" type="submit">Anfrage senden</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
