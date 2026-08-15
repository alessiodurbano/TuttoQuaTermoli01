import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { useConsent, POLICY_VERSION } from '../context/ConsentContext';
import { site, routes } from '../lib/site';

/** Segnaposto da compilare prima della pubblicazione. */
function Todo({ children }: { children: ReactNode }): ReactNode {
  return <span className="todo">{children}</span>;
}

export default function PrivacyPolicy(): ReactNode {
  useDocumentMeta(
    'Privacy policy — TuttoQua',
    'Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento UE 2016/679.',
  );

  const { openPanel } = useConsent();

  return (
    <>
      <PageHero
        breadcrumb="Privacy policy"
        eyebrow="informativa privacy"
        title="Privacy policy"
        lead="Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR)."
      />

      <section className="legal">
        <div className="wrap">
          <div className="legal-inner">
            <p className="legal-meta">
              Versione {POLICY_VERSION} · ultimo aggiornamento{' '}
              <Todo>[DATA DI PUBBLICAZIONE]</Todo>
            </p>

            <div className="placeholder-note">
              <strong>Da completare prima della pubblicazione.</strong> Le parti evidenziate in
              arancione vanno sostituite con i dati reali del titolare (ragione sociale, P.IVA, sede
              legale). Il testo è predisposto sul funzionamento effettivo di questo sito; se in
              futuro aggiungi strumenti o servizi, va aggiornato di conseguenza e la versione va
              incrementata.
            </div>

            <h2>1. Chi tratta i tuoi dati (titolare del trattamento)</h2>
            <p>
              Il titolare del trattamento è <Todo>[RAGIONE SOCIALE]</Todo>, con sede legale in{' '}
              <Todo>[INDIRIZZO SEDE LEGALE]</Todo>, P.IVA <Todo>[PARTITA IVA]</Todo>, C.F.{' '}
              <Todo>[CODICE FISCALE]</Todo>, che gestisce il punto vendita {site.name} di{' '}
              {site.city}.
            </p>
            <p>
              Per qualsiasi questione relativa ai tuoi dati puoi scrivere a{' '}
              <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a> o telefonare al{' '}
              <a href={site.phoneHref}>{site.phone}</a>.
            </p>
            <p>
              Responsabile della protezione dei dati (DPO): <Todo>[NON NOMINATO / CONTATTO DPO]</Todo>
              . La nomina del DPO non è obbligatoria per attività commerciali che non svolgono
              monitoraggio sistematico su larga scala; se non lo nomini, lascia scritto «non
              nominato».
            </p>

            <h2>2. Quali dati raccogliamo e perché</h2>
            <p>
              Raccogliamo solo i dati che ci servono davvero, per il tempo necessario a gestire la
              tua richiesta. Non facciamo profilazione e non prendiamo decisioni automatizzate sul
              tuo conto.
            </p>

            <div className="legal-table-wrap">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Trattamento</th>
                    <th>Dati raccolti</th>
                    <th>Base giuridica</th>
                    <th>Conservazione</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Richiesta di informazioni sul franchising</td>
                    <td>
                      Nome e cognome, email, città di interesse, telefono (facoltativo), messaggio
                      (facoltativo), data del consenso, hash dell&apos;indirizzo IP e browser
                      utilizzato
                    </td>
                    <td>
                      Consenso dell&apos;interessato e misure precontrattuali su tua richiesta (art.
                      6.1 lett. a e b GDPR)
                    </td>
                    <td>24 mesi dall&apos;ultimo contatto utile</td>
                  </tr>
                  <tr>
                    <td>Candidatura spontanea (Lavora con noi)</td>
                    <td>
                      Nome, email, telefono (facoltativo), posizione desiderata, messaggio,
                      curriculum vitae se allegato, data del consenso, hash IP e browser
                    </td>
                    <td>Consenso dell&apos;interessato (art. 6.1 lett. a GDPR)</td>
                    <td>12 mesi dall&apos;invio, poi cancellazione automatica</td>
                  </tr>
                  <tr>
                    <td>Gestione delle preferenze cookie</td>
                    <td>
                      Identificativo anonimo generato dal browser, categorie accettate o rifiutate,
                      versione dell&apos;informativa, data, hash IP
                    </td>
                    <td>
                      Obbligo legale di dimostrare il consenso (artt. 7.1 GDPR e 122 Codice Privacy)
                    </td>
                    <td>12 mesi</td>
                  </tr>
                  <tr>
                    <td>Sicurezza del sito e prevenzione abusi</td>
                    <td>
                      Hash dell&apos;indirizzo IP, tipo di browser, numero di invii dei moduli
                    </td>
                    <td>
                      Legittimo interesse a proteggere il sito da spam e accessi abusivi (art. 6.1
                      lett. f GDPR)
                    </td>
                    <td>Insieme al record cui si riferiscono</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3>Una nota sull&apos;indirizzo IP</h3>
            <p>
              Non conserviamo il tuo indirizzo IP in chiaro: ne salviamo solo una versione cifrata a
              senso unico (hash con chiave segreta). Ci permette di riconoscere invii ripetuti e
              tentativi di spam, ma non di risalire a te.
            </p>

            <h3>Dati particolari</h3>
            <p>
              Non chiediamo dati appartenenti a categorie particolari (art. 9 GDPR: salute,
              convinzioni religiose, orientamento sessuale, ecc.). Se li inserisci spontaneamente
              nel curriculum o in un messaggio, li trattiamo solo per gestire la tua candidatura e
              ti invitiamo a non includerli se non necessari.
            </p>

            <h2>3. Il conferimento dei dati è obbligatorio?</h2>
            <p>
              No. Navigare sul sito non richiede di fornire alcun dato. I campi contrassegnati con
              l&apos;asterisco nei moduli sono però necessari per poterti rispondere: senza di essi
              non possiamo dar seguito alla richiesta. I campi facoltativi servono solo a
              contattarti più facilmente.
            </p>

            <h2>4. A chi comunichiamo i tuoi dati</h2>
            <p>
              <strong>
                I tuoi dati non vengono ceduti, venduti o comunicati a terzi per finalità proprie di
                questi ultimi.
              </strong>{' '}
              Restano nella gestione interna dell&apos;organizzazione e sono accessibili solo al
              personale autorizzato e istruito ai sensi dell&apos;art. 29 GDPR (titolare, staff
              incaricato della selezione del personale e dello sviluppo franchising).
            </p>
            <p>
              Possono trattare i dati per nostro conto, in qualità di responsabili del trattamento
              nominati ai sensi dell&apos;art. 28 GDPR e limitatamente a quanto necessario a
              erogare il servizio, i fornitori tecnici del sito:
            </p>
            <ul>
              <li>
                il fornitore di hosting del sito e del database: <Todo>[NOME FORNITORE HOSTING]</Todo>
              </li>
              <li>
                il fornitore del servizio di posta elettronica: <Todo>[NOME FORNITORE EMAIL]</Todo>
              </li>
              <li>
                Google Ireland Ltd., limitatamente alla mappa e alle statistiche, e solo se hai dato
                il relativo consenso (vedi la <Link to={routes.cookies}>cookie policy</Link>)
              </li>
            </ul>
            <p>
              I dati possono inoltre essere comunicati ad autorità pubbliche quando ciò è imposto da
              un obbligo di legge o richiesto dall&apos;autorità giudiziaria.
            </p>
            <p>
              L&apos;elenco aggiornato dei responsabili del trattamento è disponibile su richiesta
              scrivendo a <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>.
            </p>

            <h2>5. Trasferimenti fuori dall&apos;Unione Europea</h2>
            <p>
              I dati sono conservati su server situati nello Spazio Economico Europeo. L&apos;unica
              eccezione riguarda i servizi Google (mappa e statistiche), attivi solo con il tuo
              consenso: in quel caso il trasferimento verso gli Stati Uniti avviene sulla base della
              decisione di adeguatezza della Commissione europea del 10 luglio 2023 (EU-US Data
              Privacy Framework) e, in subordine, delle clausole contrattuali standard.
            </p>

            <h2>6. Per quanto tempo conserviamo i dati</h2>
            <p>
              Solo per il tempo necessario alle finalità indicate nella tabella al punto 2. Alla
              scadenza i record vengono cancellati automaticamente dal sistema, curriculum
              compresi. Puoi comunque chiederne la cancellazione anticipata in qualsiasi momento.
            </p>

            <h2>7. Come proteggiamo i dati</h2>
            <ul>
              <li>connessione cifrata HTTPS su tutte le pagine;</li>
              <li>accesso all&apos;area di gestione protetto da password cifrata e sessione a scadenza;</li>
              <li>curriculum salvati con nome file casuale, non pubblicamente raggiungibili;</li>
              <li>indirizzi IP conservati solo in forma di hash;</li>
              <li>registro degli accessi ai dati personali da parte del personale autorizzato;</li>
              <li>cancellazione automatica dei dati scaduti.</li>
            </ul>

            <h2>8. I tuoi diritti</h2>
            <p>
              In qualsiasi momento puoi esercitare i diritti previsti dagli artt. 15-22 del GDPR:
            </p>
            <ul>
              <li>
                <strong>accesso:</strong> sapere quali dati abbiamo e ottenerne una copia;
              </li>
              <li>
                <strong>rettifica:</strong> correggere dati inesatti o incompleti;
              </li>
              <li>
                <strong>cancellazione:</strong> chiedere la rimozione dei dati («diritto
                all&apos;oblio»);
              </li>
              <li>
                <strong>limitazione:</strong> chiedere di sospendere il trattamento;
              </li>
              <li>
                <strong>portabilità:</strong> ricevere i dati in formato leggibile da un computer;
              </li>
              <li>
                <strong>opposizione:</strong> opporti ai trattamenti basati sul legittimo interesse;
              </li>
              <li>
                <strong>revoca del consenso:</strong> in qualsiasi momento, senza che ciò pregiudichi
                la liceità del trattamento effettuato prima della revoca.
              </li>
            </ul>
            <p>
              Per esercitarli scrivi a{' '}
              <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>: rispondiamo entro un
              mese dalla richiesta, prorogabile di due mesi in casi complessi (art. 12 GDPR).
              L&apos;esercizio dei diritti è gratuito.
            </p>
            <p>
              Per revocare o modificare il consenso ai cookie non serve scriverci:{' '}
              <button type="button" className="link-btn" onClick={openPanel}>
                apri il pannello delle preferenze
              </button>
              .
            </p>

            <h2>9. Reclamo all&apos;autorità di controllo</h2>
            <p>
              Se ritieni che il trattamento dei tuoi dati violi la normativa, puoi proporre reclamo
              al Garante per la protezione dei dati personali, Piazza Venezia 11, 00187 Roma —{' '}
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
                garanteprivacy.it
              </a>{' '}
              — oppure ricorrere all&apos;autorità giudiziaria.
            </p>

            <h2>10. Modifiche a questa informativa</h2>
            <p>
              Possiamo aggiornare questa informativa per adeguarla a novità normative o a modifiche
              del sito. La versione in vigore è sempre quella pubblicata su questa pagina, con la
              data di aggiornamento in alto. Se le modifiche riguardano i cookie, ti chiederemo di
              nuovo il consenso.
            </p>

            <p className="legal-meta">
              Vedi anche la <Link to={routes.cookies}>cookie policy</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
