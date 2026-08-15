import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useConsent } from '../context/ConsentContext';
import { routes } from '../lib/site';
import { IconCookie } from './Icons';

/** Interruttore accessibile: è un vero bottone con stato aria-checked. */
function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}): ReactNode {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={() => onChange(!checked)}
    />
  );
}

export function CookieBanner(): ReactNode {
  const { preferences, needsDecision, isPanelOpen, acceptAll, rejectAll, savePreferences, closePanel, openPanel } =
    useConsent();

  const [showDetails, setShowDetails] = useState(false);
  const [draft, setDraft] = useState({
    functional: preferences.functional,
    analytics: preferences.analytics,
  });
  const dialogRef = useRef<HTMLDivElement>(null);

  const isOpen = needsDecision || isPanelOpen;

  // Riaprendo il pannello si riparte sempre dalle preferenze realmente salvate.
  useEffect(() => {
    if (isOpen) {
      setDraft({ functional: preferences.functional, analytics: preferences.analytics });
      setShowDetails(isPanelOpen && !needsDecision);
    }
  }, [isOpen, isPanelOpen, needsDecision, preferences.functional, preferences.analytics]);

  // Sposta il focus dentro il banner: chi naviga da tastiera lo trova subito.
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  // Esc chiude solo se una scelta è già stata fatta: non deve essere una scorciatoia
  // per ignorare il banner senza decidere.
  useEffect(() => {
    if (!isOpen || needsDecision) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, needsDecision, closePanel]);

  if (!isOpen) {
    // Icona sempre disponibile per rivedere la scelta (consenso revocabile).
    return (
      <button
        type="button"
        className="cookie-fab"
        onClick={openPanel}
        aria-label="Preferenze cookie"
        title="Preferenze cookie"
      >
        <IconCookie />
      </button>
    );
  }

  return (
    <div className="cookie-overlay">
      <div
        className="cookie-banner"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cookie-title"
        aria-describedby="cookie-desc"
        tabIndex={-1}
        ref={dialogRef}
      >
        <h2 id="cookie-title">🍪 Un attimo solo: i cookie</h2>
        <p id="cookie-desc">
          Usiamo cookie <strong>tecnici</strong>, necessari a far funzionare il sito, che non
          richiedono il tuo consenso. Con il tuo consenso usiamo anche cookie{' '}
          <strong>funzionali</strong> (per mostrarti la mappa di Google) e di{' '}
          <strong>statistica</strong> (per capire quante persone visitano il sito, in forma
          aggregata). Puoi accettare, rifiutare o scegliere: rifiutare non limita la consultazione
          del sito e puoi cambiare idea quando vuoi. Dettagli nella{' '}
          <Link to={routes.cookies}>cookie policy</Link> e nella{' '}
          <Link to={routes.privacy}>privacy policy</Link>.
        </p>

        {showDetails && (
          <div className="cookie-prefs">
            <div className="cookie-cat">
              <div>
                <h3>Necessari</h3>
                <p>
                  Fanno funzionare la navigazione, i moduli di contatto e la sicurezza. Senza questi
                  il sito non funziona, quindi non sono disattivabili.
                </p>
              </div>
              <span className="always">Sempre attivi</span>
            </div>

            <div className="cookie-cat">
              <div>
                <h3>Funzionali</h3>
                <p>
                  Servono a caricare la mappa di Google Maps con la posizione del negozio. Senza il
                  tuo consenso la mappa resta bloccata e trovi comunque il link per aprirla su
                  Google.
                </p>
              </div>
              <Switch
                checked={draft.functional}
                onChange={(next) => setDraft((d) => ({ ...d, functional: next }))}
                label="Cookie funzionali"
              />
            </div>

            <div className="cookie-cat">
              <div>
                <h3>Statistiche</h3>
                <p>
                  Ci dicono quante persone visitano il sito e quali pagine leggono, con IP
                  anonimizzato e senza profilazione pubblicitaria. Ci servono solo per migliorare
                  le pagine.
                </p>
              </div>
              <Switch
                checked={draft.analytics}
                onChange={(next) => setDraft((d) => ({ ...d, analytics: next }))}
                label="Cookie di statistica"
              />
            </div>
          </div>
        )}

        <div className="cookie-actions">
          {/* Rifiutare deve costare esattamente un clic, come accettare. */}
          <button type="button" className="btn btn-ghost" onClick={rejectAll}>
            Rifiuta i non necessari
          </button>

          {showDetails ? (
            <button type="button" className="btn btn-dark" onClick={() => savePreferences(draft)}>
              Salva le preferenze
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setShowDetails(true)}>
              Personalizza
            </button>
          )}

          <button type="button" className="btn btn-primary" onClick={acceptAll}>
            Accetta tutti
          </button>
        </div>

        {!needsDecision && (
          <button type="button" className="cookie-link-btn" onClick={closePanel}>
            Chiudi senza modificare
          </button>
        )}
      </div>
    </div>
  );
}
