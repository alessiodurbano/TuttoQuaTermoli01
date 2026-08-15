import type { ReactNode } from 'react';
import { useConsent } from '../context/ConsentContext';
import { site } from '../lib/site';

/**
 * Mappa di Google Maps.
 *
 * L'iframe è un servizio di terze parti: caricarlo comunica l'IP del visitatore
 * a Google. Per questo resta bloccato finché non arriva il consenso funzionale,
 * con un'alternativa sempre utilizzabile (il link a Google Maps in una scheda
 * nuova, che è una scelta consapevole dell'utente).
 */
export function MapEmbed(): ReactNode {
  const { preferences, savePreferences, openPanel } = useConsent();

  if (!preferences.functional) {
    return (
      <div className="map-shell">
        <div className="map-placeholder">
          <div>
            <h3>🗺️ Mappa bloccata</h3>
            <p>
              La mappa è fornita da Google Maps. Per caricarla serve il tuo consenso ai cookie
              funzionali, perché Google riceverebbe il tuo indirizzo IP.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => savePreferences({ functional: true, analytics: preferences.analytics })}
            >
              Carica la mappa
            </button>
            <a
              href={site.mapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Apri su Google Maps ↗
            </a>
            <div>
              <button type="button" className="cookie-link-btn" onClick={openPanel}>
                Gestisci le preferenze cookie
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-shell">
      <iframe
        title={`Mappa ${site.name} ${site.city}`}
        src={site.mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
