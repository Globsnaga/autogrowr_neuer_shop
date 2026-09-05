import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useCart } from '../context/CartContext.jsx';
import { sdk, formatMoney } from '../lib/medusa.js';
import useSeo from '../hooks/useSeo.js';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const emptyAddress = {
  first_name: '',
  last_name: '',
  address_1: '',
  address_2: '',
  postal_code: '',
  city: '',
  country_code: 'de',
  phone: '',
};

/** Schritt 1: Kontakt + Lieferadresse. */
function AddressStep({ onDone }) {
  const { cart, updateCart, error } = useCart();
  const [email, setEmail] = useState(cart?.email || '');
  const [address, setAddress] = useState({ ...emptyAddress, ...(cart?.shipping_address || {}) });
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  const set = (key) => (e) => setAddress((a) => ({ ...a, [key]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (!/.+@.+\..+/.test(email)) {
      setLocalError('Bitte eine gültige E-Mail-Adresse angeben.');
      return;
    }
    setLocalError('');
    setSaving(true);
    try {
      await updateCart({ email, shipping_address: address, billing_address: address });
      onDone();
    } catch (e2) {
      setLocalError(e2?.message || 'Adresse konnte nicht gespeichert werden.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card elev-sm ag-form-card">
      <h3 className="ag-sent-title" style={{ marginBottom: 6 }}>Kontakt &amp; Lieferadresse</h3>

      <div className="field">
        <label htmlFor="email">E-Mail</label>
        <input className="input" id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="ag-field-row">
        <div className="field">
          <label htmlFor="first_name">Vorname</label>
          <input className="input" id="first_name" required value={address.first_name} onChange={set('first_name')} />
        </div>
        <div className="field">
          <label htmlFor="last_name">Nachname</label>
          <input className="input" id="last_name" required value={address.last_name} onChange={set('last_name')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="address_1">Straße und Hausnummer</label>
        <input className="input" id="address_1" required value={address.address_1} onChange={set('address_1')} />
      </div>

      <div className="ag-field-row">
        <div className="field">
          <label htmlFor="postal_code">PLZ</label>
          <input className="input" id="postal_code" required value={address.postal_code} onChange={set('postal_code')} />
        </div>
        <div className="field">
          <label htmlFor="city">Stadt</label>
          <input className="input" id="city" required value={address.city} onChange={set('city')} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="phone">Telefon (für Versandrückfragen)</label>
        <input className="input" id="phone" type="tel" value={address.phone} onChange={set('phone')} />
      </div>

      {(localError || error) && <p className="ag-error" role="alert">{localError || error}</p>}

      <button className="btn btn-primary btn-block ag-btn-lg" type="submit" disabled={saving}>
        {saving ? 'Wird gespeichert …' : 'Weiter zum Versand'}
      </button>
    </form>
  );
}

/** Schritt 2: Versandart wählen. */
function ShippingStep({ onDone, onBack }) {
  const { cart, addShippingMethod, error } = useCart();
  const [options, setOptions] = useState(null);
  const [selected, setSelected] = useState(cart?.shipping_methods?.[0]?.shipping_option_id || '');
  const [saving, setSaving] = useState(false);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!cart) return;
    sdk.store.fulfillment
      .listCartOptions({ cart_id: cart.id })
      .then(({ shipping_options }) => setOptions(shipping_options))
      .catch((e) => setLocalError(e?.message || 'Versandarten konnten nicht geladen werden.'));
  }, [cart?.id]);

  async function submit(e) {
    e.preventDefault();
    if (!selected) {
      setLocalError('Bitte eine Versandart auswählen.');
      return;
    }
    setSaving(true);
    setLocalError('');
    try {
      await addShippingMethod(selected);
      onDone();
    } catch (e2) {
      setLocalError(e2?.message || 'Versandart konnte nicht gesetzt werden.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="card elev-sm ag-form-card">
      <h3 className="ag-sent-title" style={{ marginBottom: 6 }}>Versandart</h3>

      {!options ? (
        <p className="text-muted">Versandarten werden geladen …</p>
      ) : options.length === 0 ? (
        <p className="text-muted">
          Keine Versandart für diese Adresse hinterlegt. Im Medusa-Admin unter Einstellungen →
          Versand eine Versandoption für die Region anlegen.
        </p>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {options.map((opt) => (
            <label key={opt.id} className="seg-opt" style={{ border: '1px solid var(--color-divider)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
              <input type="radio" name="shipping" value={opt.id} checked={selected === opt.id} onChange={() => setSelected(opt.id)} />
              <span style={{ flex: 1 }}>{opt.name}</span>
              <span className="ag-price">{formatMoney(opt.calculated_price?.calculated_amount, opt.calculated_price?.currency_code)}</span>
            </label>
          ))}
        </div>
      )}

      {(localError || error) && <p className="ag-error" role="alert">{localError || error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="btn btn-secondary" type="button" onClick={onBack}>← Zurück</button>
        <button className="btn btn-primary ag-btn-lg" type="submit" disabled={saving || !options?.length} style={{ flex: 1 }}>
          {saving ? 'Wird gespeichert …' : 'Weiter zur Zahlung'}
        </button>
      </div>
    </form>
  );
}

/** Schritt 3: Zahlung über Stripe (Medusa Payment Session). */
function PaymentForm({ onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const { completeCart, error } = useCart();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [localError, setLocalError] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setLocalError('');
    try {
      const { error: stripeError } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
      if (stripeError) {
        setLocalError(stripeError.message);
        return;
      }
      const order = await completeCart();
      navigate('/bestellung/' + order.id, { state: { order } });
    } catch (e2) {
      setLocalError(e2?.message || 'Zahlung konnte nicht abgeschlossen werden.');
    } finally {
      setPaying(false);
    }
  }

  return (
    <form onSubmit={submit} className="card elev-sm ag-form-card">
      <h3 className="ag-sent-title" style={{ marginBottom: 6 }}>Zahlung</h3>
      <PaymentElement />

      {(localError || error) && <p className="ag-error" role="alert">{localError || error}</p>}

      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button className="btn btn-secondary" type="button" onClick={onBack}>← Zurück</button>
        <button className="btn btn-primary ag-btn-lg" type="submit" disabled={!stripe || paying} style={{ flex: 1 }}>
          {paying ? 'Wird bezahlt …' : 'Jetzt kostenpflichtig bestellen'}
        </button>
      </div>
    </form>
  );
}

function PaymentStep({ onBack }) {
  const { cart, error } = useCart();
  const [clientSecret, setClientSecret] = useState(null);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (!cart) return;
    sdk.store.payment
      .initiatePaymentSession(cart, { provider_id: 'pp_stripe_stripe' })
      .then((res) => {
        const secret = res.payment_collection?.payment_sessions?.[0]?.data?.client_secret;
        if (!secret) {
          setLocalError('Stripe hat keinen client_secret geliefert — Stripe-Plugin im Backend konfiguriert?');
          return;
        }
        setClientSecret(secret);
      })
      .catch((e) => setLocalError(e?.message || 'Zahlungssitzung konnte nicht gestartet werden.'));
    // Kein reloadCart() hier: das setzt im CartContext kurz loading=true, wodurch
    // CheckoutPage PaymentStep komplett unmountet (Ladebildschirm) und beim Zurück-
    // rendern neu mountet — was diesen useEffect erneut auslöst und eine Endlos-
    // schleife aus initiatePaymentSession-Aufrufen erzeugt. Der Cart selbst ändert
    // sich durch das Anlegen einer Payment-Session nicht, ein Reload ist unnötig.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart?.id]);

  if (!stripePromise) {
    return (
      <p className="ag-error" role="alert">
        VITE_STRIPE_PUBLISHABLE_KEY fehlt in .env — siehe MEDUSA_SETUP.md.
      </p>
    );
  }
  if (localError || error) {
    return <p className="ag-error" role="alert">{localError || error}</p>;
  }
  if (!clientSecret) {
    return <p className="text-muted">Zahlung wird vorbereitet …</p>;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'night',
          variables: {
            colorPrimary: '#9184d9',
            colorBackground: '#232532',
            colorText: '#e9e9ed',
            borderRadius: '8px',
          },
        },
      }}
    >
      <PaymentForm onBack={onBack} />
    </Elements>
  );
}

export default function CheckoutPage() {
  const { cart, loading } = useCart();
  const [step, setStep] = useState('address');

  useSeo({ title: 'Kasse', path: '/checkout', noindex: true });

  const items = cart?.items || [];
  const summary = useMemo(
    () => ({
      subtotal: cart?.subtotal,
      shipping: cart?.shipping_total,
      total: cart?.total,
      currency: cart?.currency_code,
    }),
    [cart]
  );

  if (loading) {
    return <main id="top"><div className="ag-wrap ag-section"><p className="text-muted">Warenkorb wird geladen …</p></div></main>;
  }

  if (!items.length) {
    return (
      <main id="top">
        <div className="ag-wrap ag-section">
          <p className="text-muted">Dein Warenkorb ist leer.</p>
          <Link className="btn btn-primary" to="/shop">Zum Shop</Link>
        </div>
      </main>
    );
  }

  return (
    <main id="top">
      <div className="ag-wrap ag-section ag-two" style={{ alignItems: 'start' }}>
        <div data-reveal="0">
          {step === 'address' && <AddressStep onDone={() => setStep('shipping')} />}
          {step === 'shipping' && <ShippingStep onDone={() => setStep('payment')} onBack={() => setStep('address')} />}
          {step === 'payment' && <PaymentStep onBack={() => setStep('shipping')} />}
        </div>

        <aside className="card elev-sm ag-form-card" data-reveal="80">
          <h3 className="ag-sent-title" style={{ marginBottom: 14 }}>Bestellübersicht</h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            {items.map((item) => (
              <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                <span>{item.quantity}× {item.product_title || item.title}</span>
                <span>{formatMoney(item.total, summary.currency)}</span>
              </li>
            ))}
          </ul>
          <div className="ag-rule" />
          <div className="ag-cart-summary">
            <span>Zwischensumme</span>
            <span>{formatMoney(summary.subtotal, summary.currency)}</span>
          </div>
          <div className="ag-cart-summary">
            <span>Versand</span>
            <span>{summary.shipping != null ? formatMoney(summary.shipping, summary.currency) : '—'}</span>
          </div>
          <div className="ag-cart-summary" style={{ fontSize: 17 }}>
            <strong>Gesamt</strong>
            <strong className="ag-price">{formatMoney(summary.total, summary.currency)}</strong>
          </div>
        </aside>
      </div>
    </main>
  );
}
