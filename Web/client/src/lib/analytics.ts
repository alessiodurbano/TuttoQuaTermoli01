/**
 * Caricamento condizionato degli script di statistica.
 *
 * Regola GDPR/ePrivacy: nessuno script di misurazione può partire prima del
 * consenso. Qui lo script viene iniettato solo quando `enableAnalytics()`
 * viene chiamata, e rimosso quando il consenso viene revocato.
 *
 * Per attivarlo davvero: metti il tuo ID di misurazione in
 * `client/.env` come VITE_GA_MEASUREMENT_ID=G-XXXXXXX
 */

const SCRIPT_ID = 'tq-analytics';
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function analyticsConfigured(): boolean {
  return Boolean(MEASUREMENT_ID);
}

export function enableAnalytics(): void {
  if (!MEASUREMENT_ID || document.getElementById(SCRIPT_ID)) return;

  const script = document.createElement('script');
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer?.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {
    // Nessun cookie pubblicitario e IP troncato: misuriamo il traffico, non le persone.
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function disableAnalytics(): void {
  document.getElementById(SCRIPT_ID)?.remove();

  if (MEASUREMENT_ID) {
    // Interruttore ufficiale di gtag.js: blocca l'invio anche se lo script è già in memoria.
    (window as unknown as Record<string, boolean>)[`ga-disable-${MEASUREMENT_ID}`] = true;
  }

  // Rimuove i cookie _ga già scritti, per il dominio corrente e per quello padre.
  const rootDomain = `.${window.location.hostname.split('.').slice(-2).join('.')}`;
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0]?.trim();
    if (!name?.startsWith('_ga') && !name?.startsWith('_gid')) continue;
    for (const domain of ['', `;domain=${window.location.hostname}`, `;domain=${rootDomain}`]) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/${domain}`;
    }
  }
}

/** Traccia un cambio pagina nella SPA (chiamato solo se il consenso è attivo). */
export function trackPageView(path: string): void {
  if (!MEASUREMENT_ID || !window.gtag) return;
  window.gtag('event', 'page_view', { page_path: path });
}
