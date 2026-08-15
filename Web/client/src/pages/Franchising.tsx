import { useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { apiPost, ApiError } from '../lib/api';
import { site, routes } from '../lib/site';
import { IconBox, IconMegaphone, IconTrend, IconHeart } from '../components/Icons';

const BENEFITS = [
  {
    Icon: IconBox,
    title: 'Assortimento pronto',
    text: 'Un catalogo curato e sempre in aggiornamento con molte referenze.',
  },
  {
    Icon: IconMegaphone,
    title: 'Brand in crescita',
    text: 'Una presenza online ed offline forte e riconoscibile che ti aiuta a differenziarti dalla concorrenza.',
  },
  {
    Icon: IconTrend,
    title: 'Modello a basso rischio',
    text: 'Investimento contenuto con margini fin da subito chiari ed ordinati.',
  },
  {
    Icon: IconHeart,
    title: 'Ti aiutiamo noi',
    text: 'Dall’apertura fino alla vendita dei prodotti sullo scaffale sarai sempre affiancato da noi.',
  },
];

const STEPS = [
  { n: '01', t: 'Contatto', d: 'Compila il modulo: ti ricontattiamo entro 48h.' },
  { n: '02', t: 'Feasibility', d: 'Analizziamo insieme la tua città e la location ideale.' },
  { n: '03', t: 'Apertura', d: 'Arredamento, fornitura e lancio: siamo sul campo con te.' },
  { n: '04', t: 'Crescita', d: 'Marketing locale e rifornimento continuo per far girare il negozio.' },
];

interface LeadForm {
  name: string;
  email: string;
  city: string;
  phone: string;
  message: string;
  consentPrivacy: boolean;
  website: string;
}

const EMPTY_FORM: LeadForm = {
  name: '',
  email: '',
  city: '',
  phone: '',
  message: '',
  consentPrivacy: false,
  website: '',
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Franchising(): ReactNode {
  useDocumentMeta(
    'Franchising — Apri TuttoQua nella tua città',
    'Come aprire un punto vendita TuttoQua: vantaggi, percorso passo dopo passo e modulo di contatto.',
  );

  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const update = <K extends keyof LeadForm>(key: K, value: LeadForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setStatus('sending');
    setFieldErrors({});

    try {
      await apiPost('/franchise-leads', { ...form });
      setStatus('sent');
      setMessage('Richiesta inviata! Ti ricontattiamo entro 48 ore.');
      setForm(EMPTY_FORM);
    } catch (error) {
      setStatus('error');
      if (error instanceof ApiError) {
        setFieldErrors(error.fields);
        setMessage(error.message);
      } else {
        setMessage('Connessione non riuscita. Riprova tra poco.');
      }
    }
  }

  return (
    <>
      <PageHero
        breadcrumb="Franchising"
        eyebrow="franchising"
        title={
          <>
            Apri <span style={{ color: 'var(--orange)' }}>TuttoQua</span> nella{' '}
            <span className="hl-blue">tua città.</span>
          </>
        }
        lead="Un format giovane e dinamico in continua crescita! Tuffati nel retail e sperimenta il nostro brand. Lo faremo insieme a te, step by step."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="fr-grid" style={{ marginTop: '1rem' }}>
            <div className="benefits">
              {BENEFITS.map(({ Icon, title, text }) => (
                <div className="benefit" key={title}>
                  <span className="ic">
                    <Icon />
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="steps">
              <h3>Il percorso</h3>
              <p className="sub">Dal contatto all’apertura, step by step.</p>
              <ol>
                {STEPS.map((step) => (
                  <li key={step.n}>
                    <span className="n">{step.n}</span>
                    <div>
                      <p className="t">{step.t}</p>
                      <p className="d">{step.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <form className="form-card" onSubmit={handleSubmit} noValidate id="modulo">
              <div>
                <h3>Sei pronto? Iniziamo!</h3>
                <p className="hint">Pochi campi. Ti ricontattiamo noi.</p>
              </div>

              <label className="field">
                <span className="lbl">
                  Nome e cognome <span className="req">*</span>
                </span>
                <input
                  required
                  name="name"
                  autoComplete="name"
                  placeholder="Mario Rossi"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                />
                {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
              </label>

              <label className="field">
                <span className="lbl">
                  Email <span className="req">*</span>
                </span>
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="mario@email.it"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </label>

              <label className="field">
                <span className="lbl">
                  Città di interesse <span className="req">*</span>
                </span>
                <input
                  required
                  name="city"
                  placeholder="es. Campobasso"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  aria-invalid={Boolean(fieldErrors.city)}
                />
                {fieldErrors.city && <span className="field-error">{fieldErrors.city}</span>}
              </label>

              <label className="field">
                <span className="lbl">Telefono</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="+39 ..."
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                />
              </label>

              <label className="field">
                <span className="lbl">Messaggio (facoltativo)</span>
                <textarea
                  rows={2}
                  name="message"
                  placeholder="Raccontaci la tua idea..."
                  value={form.message}
                  onChange={(e) => update('message', e.target.value)}
                />
              </label>

              {/* Campo esca: invisibile alle persone, compilato solo dai bot. */}
              <div className="honeypot" aria-hidden>
                <label>
                  Non compilare questo campo
                  <input
                    tabIndex={-1}
                    autoComplete="off"
                    name="website"
                    value={form.website}
                    onChange={(e) => update('website', e.target.value)}
                  />
                </label>
              </div>

              <label className="consent-row">
                <input
                  type="checkbox"
                  required
                  checked={form.consentPrivacy}
                  onChange={(e) => update('consentPrivacy', e.target.checked)}
                  aria-invalid={Boolean(fieldErrors.consentPrivacy)}
                />
                <span>
                  Ho letto la <Link to={routes.privacy}>privacy policy</Link> e acconsento al
                  trattamento dei miei dati per essere ricontattato in merito alla richiesta.{' '}
                  <span className="req">*</span>
                </span>
              </label>
              {fieldErrors.consentPrivacy && (
                <span className="field-error">{fieldErrors.consentPrivacy}</span>
              )}

              <button type="submit" className="btn-submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Invio in corso…' : 'Invia richiesta ➤'}
              </button>

              {/* aria-live: gli screen reader annunciano l'esito senza spostare il focus. */}
              <div aria-live="polite">
                {status === 'sent' && <div className="alert">✓ {message}</div>}
                {status === 'error' && <div className="alert err">⚠ {message}</div>}
              </div>

              <p className="form-foot">
                Oppure scrivi a{' '}
                <a href={`mailto:${site.franchisingEmail}`}>
                  <b>{site.franchisingEmail}</b>
                </a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
