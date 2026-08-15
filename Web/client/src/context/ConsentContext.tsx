import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ConsentAction, ConsentPreferences, StoredConsent } from '../types';
import { apiPost } from '../lib/api';
import { enableAnalytics, disableAnalytics } from '../lib/analytics';

/**
 * Stato del consenso cookie, unica fonte di verità per tutta l'app.
 *
 * Principi implementati:
 * - nessuna categoria opzionale è attiva di default (nessun pre-spuntato);
 * - rifiutare costa un clic quanto accettare;
 * - la scelta è revocabile in qualsiasi momento dal footer;
 * - se cambia la versione dell'informativa, il consenso va richiesto di nuovo.
 */

export const POLICY_VERSION = '1.0';
const STORAGE_KEY = 'tq_cookie_consent';
const VISITOR_KEY = 'tq_visitor_id';

const DENY_ALL: ConsentPreferences = { necessary: true, functional: false, analytics: false };
const ALLOW_ALL: ConsentPreferences = { necessary: true, functional: true, analytics: true };

interface ConsentContextValue {
  /** Preferenze attive. Prima della scelta sono tutte negate. */
  preferences: ConsentPreferences;
  /** true finché il visitatore non ha ancora deciso (o la policy è cambiata). */
  needsDecision: boolean;
  /** true quando il pannello preferenze è aperto. */
  isPanelOpen: boolean;
  decidedAt: string | null;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (next: Omit<ConsentPreferences, 'necessary'>) => void;
  withdraw: () => void;
  openPanel: () => void;
  closePanel: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

function readStoredConsent(): StoredConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredConsent;
    // Informativa aggiornata → il vecchio consenso non è più valido.
    if (parsed.policyVersion !== POLICY_VERSION) return null;

    return parsed;
  } catch {
    return null;
  }
}

function getVisitorId(): string {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;

    const created = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, created);
    return created;
  } catch {
    // Storage non disponibile (navigazione privata): id volatile, va bene lo stesso.
    return crypto.randomUUID();
  }
}

export function ConsentProvider({ children }: { children: ReactNode }): ReactNode {
  const [stored, setStored] = useState<StoredConsent | null>(() => readStoredConsent());
  const [isPanelOpen, setPanelOpen] = useState(false);

  const preferences: ConsentPreferences = useMemo(
    () =>
      stored
        ? { necessary: true, functional: stored.functional, analytics: stored.analytics }
        : DENY_ALL,
    [stored],
  );

  // Attiva o disattiva gli script in base al consenso corrente.
  useEffect(() => {
    if (preferences.analytics) enableAnalytics();
    else disableAnalytics();
  }, [preferences.analytics]);

  const persist = useCallback((next: ConsentPreferences, action: ConsentAction) => {
    const record: StoredConsent = {
      ...next,
      visitorId: getVisitorId(),
      action,
      policyVersion: POLICY_VERSION,
      decidedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch {
      // Se il browser blocca lo storage la scelta vale per la sessione corrente.
    }

    setStored(record);
    setPanelOpen(false);

    // Registrazione lato server per poter dimostrare il consenso (art. 7.1 GDPR).
    void apiPost('/consents', {
      visitorId: record.visitorId,
      functional: record.functional,
      analytics: record.analytics,
      action,
    }).catch(() => {
      // La scelta dell'utente resta valida anche se la registrazione non riesce.
    });
  }, []);

  const value = useMemo<ConsentContextValue>(
    () => ({
      preferences,
      needsDecision: stored === null,
      isPanelOpen,
      decidedAt: stored?.decidedAt ?? null,
      acceptAll: () => persist(ALLOW_ALL, 'accept_all'),
      rejectAll: () => persist(DENY_ALL, 'reject_all'),
      savePreferences: (next) => persist({ necessary: true, ...next }, 'custom'),
      withdraw: () => {
        // Revoca completa: gli script vengono spenti e il banner torna a comparire,
        // come se fosse la prima visita.
        void apiPost('/consents', {
          visitorId: getVisitorId(),
          functional: false,
          analytics: false,
          action: 'withdraw',
        }).catch(() => undefined);

        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Storage non disponibile: la revoca vale comunque per questa sessione.
        }

        setStored(null);
        setPanelOpen(false);
      },
      openPanel: () => setPanelOpen(true),
      closePanel: () => setPanelOpen(false),
    }),
    [preferences, stored, isPanelOpen, persist],
  );

  return <ConsentContext.Provider value={value}>{children}</ConsentContext.Provider>;
}

export function useConsent(): ConsentContextValue {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent va usato dentro <ConsentProvider>');
  }
  return context;
}
