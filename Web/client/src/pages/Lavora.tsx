import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { apiPost, ApiError } from '../lib/api';
import { site, routes } from '../lib/site';
import { IconUpload, IconSparkle } from '../components/Icons';
import type { Personality } from '../types';

const PERSONALITIES: { value: Personality; label: string; className: string }[] = [
  { value: 'Creativo', label: '🎨 Creativo', className: 't-creativo' },
  { value: 'Risolutore', label: '🔧 Risolutore', className: 't-risolutore' },
  { value: 'People person', label: '👥 People person', className: 't-people' },
];

const MAX_CV_MB = 5;

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  role: string;
  message: string;
  consentPrivacy: boolean;
  website: string;
}

const EMPTY_FORM: ApplicationForm = {
  name: '',
  email: '',
  phone: '',
  role: '',
  message: '',
  consentPrivacy: false,
  website: '',
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Lavora(): ReactNode {
  useDocumentMeta(
    'Lavora con noi — TuttoQua Termoli',
    'Candidati per lavorare in TuttoQua a Termoli: invia il tuo CV e raccontaci chi sei.',
  );

  const [form, setForm] = useState<ApplicationForm>(EMPTY_FORM);
  const [personality, setPersonality] = useState<Personality | ''>('');
  const [cv, setCv] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof ApplicationForm>(key: K, value: ApplicationForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  function handleCvChange(file: File | null): void {
    if (file && file.size > MAX_CV_MB * 1024 * 1024) {
      setStatus('error');
      setMessage(`Il CV supera i ${MAX_CV_MB} MB. Comprimilo o inviacelo via email.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setCv(file);
    if (status === 'error') setStatus('idle');
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setStatus('sending');
    setFieldErrors({});

    // multipart/form-data: è l'unico modo per allegare il CV alla stessa richiesta.
    const payload = new FormData();
    payload.append('name', form.name);
    payload.append('email', form.email);
    payload.append('phone', form.phone);
    payload.append('role', form.role);
    payload.append('message', form.message);
    payload.append('personality', personality);
    payload.append('consentPrivacy', String(form.consentPrivacy));
    payload.append('website', form.website);
    if (cv) payload.append('cv', cv);

    try {
      await apiPost('/job-applications', payload);
      setStatus('sent');
      setMessage('Candidatura inviata! Grazie, ti ricontattiamo presto.');
      setForm(EMPTY_FORM);
      setPersonality('');
      setCv(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
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
        breadcrumb="Lavora con noi"
        eyebrow="lavora con noi"
        title={
          <>
            Cerchiamo persone <span className="hl">con la Q maiuscola!</span>
          </>
        }
        lead="Ammiriamo chi ha energia, curiosità e voglia di mettersi in gioco. Ti riconosci in una di queste qualità?"
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="lav-grid">
            <div className="lav-photo">
              <div className="box">
                <img src={site.images.staff} alt="Staff TuttoQua" loading="lazy" />
              </div>
              <IconSparkle className="star" />
            </div>

            <div className="lav-form">
              <h2>Raccontaci chi sei</h2>
              <p className="lead">
                Non serve un curriculum perfetto: ci interessa capire come lavori e cosa ti piace
                fare.
              </p>

              <p className="toggles-label" id="personality-label">
                Giochino! Come ti descriveresti?
              </p>
              <div className="toggles" role="group" aria-labelledby="personality-label">
                {PERSONALITIES.map((option) => {
                  const active = personality === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={`toggle ${option.className} ${active ? 'active' : ''}`}
                      aria-pressed={active}
                      onClick={() => setPersonality(active ? '' : option.value)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <label className="field">
                  <span className="lbl">
                    Nome <span className="req">*</span>
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
                  <span className="lbl">Posizione desiderata</span>
                  <input
                    name="role"
                    placeholder="es. Addetto vendita"
                    value={form.role}
                    onChange={(e) => update('role', e.target.value)}
                  />
                </label>

                <label className="field full">
                  <span className="lbl">Messaggio (facoltativo)</span>
                  <textarea
                    rows={3}
                    name="message"
                    placeholder="Raccontati in due righe..."
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                  />
                </label>

                <div className="full">
                  <span
                    className="lbl"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--ink-60)',
                      display: 'block',
                      marginBottom: '0.375rem',
                    }}
                  >
                    CV (PDF, DOC o DOCX — max {MAX_CV_MB} MB, facoltativo)
                  </span>
                  <div className="cv-box">
                    <IconUpload />
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      id="cv-upload"
                      ref={fileInputRef}
                      onChange={(e) => handleCvChange(e.target.files?.[0] ?? null)}
                    />
                    <label htmlFor="cv-upload">
                      {cv ? `${cv.name} ✓` : 'Seleziona il file'}
                    </label>
                    {cv && (
                      <button
                        type="button"
                        className="link-btn danger"
                        onClick={() => handleCvChange(null)}
                      >
                        rimuovi
                      </button>
                    )}
                  </div>
                </div>

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

                <label className="consent-row full">
                  <input
                    type="checkbox"
                    required
                    checked={form.consentPrivacy}
                    onChange={(e) => update('consentPrivacy', e.target.checked)}
                    aria-invalid={Boolean(fieldErrors.consentPrivacy)}
                  />
                  <span>
                    Ho letto la <Link to={routes.privacy}>privacy policy</Link> e acconsento al
                    trattamento dei miei dati, incluso il CV, per la valutazione della candidatura.{' '}
                    <span className="req">*</span>
                  </span>
                </label>
                {fieldErrors.consentPrivacy && (
                  <span className="field-error full">{fieldErrors.consentPrivacy}</span>
                )}

                <button
                  type="submit"
                  className="btn-submit full"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Invio in corso…' : 'Invia candidatura ➤'}
                </button>

                <div className="full" aria-live="polite">
                  {status === 'sent' && <div className="alert">✓ {message}</div>}
                  {status === 'error' && <div className="alert err">⚠ {message}</div>}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
