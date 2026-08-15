import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useConsent, POLICY_VERSION } from '../context/ConsentContext';
import { site, routes } from '../lib/site';

function Todo({ children }: { children: ReactNode }): ReactNode {
  return <span className="todo">{children}</span>;
}

export default function CookiePolicy(): ReactNode {
  useDocumentMeta(
    'Cookie policy — TuttoQua',
    'Quali cookie usa il sito TuttoQua, a cosa servono e come gestire il consenso.',
  );

  const { openPanel, preferences, decidedAt } = useConsent();

  const decisionLabel = decidedAt
    ? new Date(decidedAt).toLocaleString('it-IT', { dateStyle: 'long', timeStyle: 'short' })
    : null;

  return (
    <>
      <PageHero
        breadcrumb="Cookie policy"
        eyebrow="cookie"
        title="Cookie policy"
        lead="Cosa salviamo sul tuo dispositivo, perché, e come cambiare idea in qualsiasi momento."
      />

      <section className="legal">
        <div className="wrap">
          <div className="legal-inner">
            <p className="legal-meta">
              Versione {POLICY_VERSION} · ultimo aggiornamento <Todo>[DATA DI PUBBLICAZIONE]</Todo>
            </p>

            <div className="placeholder-note">
              <strong>La tua scelta attuale.</strong>
              <br />
              Cookie necessari: sempre attivi. Funzionali:{' '}
              <strong>{preferences.functional ? 'attivi' : 'disattivati'}</strong>. Statistiche:{' '}
              <strong>{preferences.analytics ? 'attive' : 'disattivate'}</strong>.
              {decisionLabel && <> Scelta registrata il {decisionLabel}.</>}
              <br />
              <button type="button" className="link-btn" onClick={openPanel}>
                Modifica le preferenze cookie
              </button>
            </div>

            <h2>1. Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file di testo che i siti salvano sul dispositivo di chi naviga.
              Servono a far funzionare il sito, a ricordare le preferenze e — in alcuni casi — a
              misurare come viene usato. Trattiamo allo stesso modo le tecnologie equivalenti, come
              il <em>localStorage</em> del browser.
            </p>

            <h2>2. Come chiediamo il consenso</h2>
            <p>
              Alla prima visita compare un banner. Fino a quando non scegli, nessun cookie diverso
              da quelli tecnici viene installato: la mappa resta bloccata e nessuno script di
              statistica viene caricato. Rifiutare richiede un solo clic, esattamente come
              accettare, e non limita in alcun modo la consultazione del sito.
            </p>
            <p>
              La tua scelta viene salvata sul tuo browser e registrata sui nostri server insieme a
              un identificativo anonimo, così possiamo dimostrare di aver raccolto il consenso come
              richiede l&apos;art. 7.1 del GDPR. Se aggiorniamo questa informativa, il consenso ti
              viene richiesto di nuovo.
            </p>

            <h2>3. I cookie che usiamo</h2>

            <h3>Cookie tecnici e necessari — sempre attivi</h3>
            <p>
              Non richiedono consenso (art. 122 del Codice Privacy) perché senza di essi il sito non
              può funzionare.
            </p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Finalità</th>
                    <th>Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>tq_cookie_consent</td>
                    <td>localStorage, prima parte</td>
                    <td>Memorizza le tue scelte sui cookie, così il banner non ricompare</td>
                    <td>12 mesi</td>
                  </tr>
                  <tr>
                    <td>tq_visitor_id</td>
                    <td>localStorage, prima parte</td>
                    <td>
                      Identificativo casuale e anonimo che collega la scelta al registro dei
                      consensi. Non è collegato al tuo nome né alla tua email
                    </td>
                    <td>12 mesi</td>
                  </tr>
                  <tr>
                    <td>tq_admin</td>
                    <td>Cookie tecnico, prima parte</td>
                    <td>
                      Mantiene la sessione di chi accede all&apos;area riservata dello staff. Non
                      viene mai impostato per i visitatori del sito
                    </td>
                    <td>8 ore</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Cookie funzionali — solo con il tuo consenso</h3>
            <p>
              Servono a caricare la mappa di Google Maps che mostra dove siamo. Se non li accetti,
              al posto della mappa trovi un riquadro con il link per aprirla direttamente su Google:
              il sito resta pienamente utilizzabile.
            </p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Servizio</th>
                    <th>Fornitore</th>
                    <th>Finalità</th>
                    <th>Informativa</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Google Maps</td>
                    <td>Google Ireland Ltd., Gordon House, Barrow Street, Dublino 4, Irlanda</td>
                    <td>
                      Visualizzazione della mappa con la posizione del negozio. Caricando la mappa,
                      Google riceve il tuo indirizzo IP e può installare cookie propri
                    </td>
                    <td>
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        policies.google.com/privacy
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Cookie di statistica — solo con il tuo consenso</h3>
            <p>
              Ci dicono quante persone visitano il sito e quali pagine leggono. Li usiamo in forma
              aggregata, con IP anonimizzato e senza segnali pubblicitari: non servono a profilarti
              né a mostrarti annunci.
            </p>
            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Fornitore</th>
                    <th>Finalità</th>
                    <th>Durata</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>_ga</td>
                    <td>Google Ireland Ltd.</td>
                    <td>Distingue i visitatori per il conteggio delle visite</td>
                    <td>13 mesi</td>
                  </tr>
                  <tr>
                    <td>_ga_&lt;ID&gt;</td>
                    <td>Google Ireland Ltd.</td>
                    <td>Mantiene lo stato della sessione di misurazione</td>
                    <td>13 mesi</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              <strong>Nota tecnica:</strong> le statistiche si attivano solo se è configurato un ID
              di misurazione (<Todo>[ID GOOGLE ANALYTICS, es. G-XXXXXXX]</Todo>). Finché non lo
              inserisci nella configurazione del sito, nessuno script di statistica viene caricato
              nemmeno se dai il consenso.
            </p>

            <h3>Cookie di profilazione e marketing</h3>
            <p>
              <strong>Non ne usiamo.</strong> Nessun pixel pubblicitario, nessun retargeting, nessuna
              condivisione dei tuoi dati con circuiti di advertising.
            </p>

            <h2>4. Revocare o modificare il consenso</h2>
            <p>
              Puoi cambiare idea quando vuoi: usa il pulsante con l&apos;icona del biscotto in basso
              a sinistra, il link «Preferenze cookie» nel footer, oppure{' '}
              <button type="button" className="link-btn" onClick={openPanel}>
                apri subito il pannello
              </button>
              . Se revochi il consenso, gli script vengono disattivati e i cookie già presenti
              rimossi.
            </p>
            <p>
              Puoi anche gestire o cancellare i cookie dalle impostazioni del tuo browser (
              <a
                href="https://support.google.com/chrome/answer/95647"
                target="_blank"
                rel="noopener noreferrer"
              >
                Chrome
              </a>
              ,{' '}
              <a
                href="https://support.apple.com/it-it/guide/safari/sfri11471/mac"
                target="_blank"
                rel="noopener noreferrer"
              >
                Safari
              </a>
              ,{' '}
              <a
                href="https://support.mozilla.org/it/kb/protezione-antitracciamento-avanzata-firefox-desktop"
                target="_blank"
                rel="noopener noreferrer"
              >
                Firefox
              </a>
              ,{' '}
              <a
                href="https://support.microsoft.com/it-it/microsoft-edge"
                target="_blank"
                rel="noopener noreferrer"
              >
                Edge
              </a>
              ). Attenzione: bloccando tutti i cookie alcune funzioni del sito potrebbero non
              funzionare.
            </p>

            <h2>5. Titolare e contatti</h2>
            <p>
              Titolare del trattamento: <Todo>[RAGIONE SOCIALE]</Todo>, <Todo>[INDIRIZZO SEDE]</Todo>
              , P.IVA <Todo>[PARTITA IVA]</Todo>. Per qualsiasi domanda sui cookie scrivi a{' '}
              <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
            </p>
            <p>
              Il dettaglio completo su come trattiamo i dati personali è nella{' '}
              <Link to={routes.privacy}>privacy policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
