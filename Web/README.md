# TuttoQua — sito multipagina

Sito del negozio **TuttoQua** di Termoli (CB). Frontend React + TypeScript (Vite),
backend Node + Express + TypeScript, database gestito con Prisma.

> **Se è la prima volta, parti dalla sezione 1 e vai in ordine.**
> Tutti i comandi si eseguono nel terminale di VS Code: aprilo con **⌃ `** (Control + backtick)
> oppure dal menu *Terminal → New Terminal*. La shell è `zsh`.

---

## 1. Installare Node.js (una volta sola)

Su questo Mac Node **non è installato**. Verifica:

```bash
node -v
```

Se risponde `command not found`, installalo. Due strade, scegline **una**.

### Strada A — installer grafico (la più semplice)

1. vai su <https://nodejs.org/it>
2. scarica la versione **LTS** (il pulsante di sinistra)
3. apri il `.pkg` e vai avanti fino alla fine
4. **chiudi e riapri VS Code** (serve perché il terminale rilegga il PATH)

### Strada B — da terminale con nvm

Utile se in futuro ti serviranno più versioni di Node.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Chiudi e riapri il terminale, poi:

```bash
nvm install 20
```

```bash
nvm use 20
```

### Verifica (obbligatoria prima di proseguire)

```bash
node -v && npm -v
```

Devi vedere due numeri di versione, con Node **20 o superiore** (es. `v20.18.0` e `10.8.2`).
Se ancora non funziona, chiudi completamente VS Code (⌘Q) e riaprilo.

---

## 2. Preparare il progetto (una volta sola)

Apri la cartella del progetto in VS Code (*File → Open Folder…* → `Documents/Web`),
poi apri il terminale integrato e lancia i comandi in quest'ordine.

**2.1 — Posizionati nella cartella del progetto**

```bash
cd ~/Documents/Web
```

**2.2 — Crea il file di configurazione del backend**

```bash
cp server/.env.example server/.env
```

**2.3 — Genera le due chiavi segrete**

```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(48).toString('hex'))"
```

```bash
node -e "console.log('IP_HASH_SALT=' + require('crypto').randomBytes(48).toString('hex'))"
```

Apri `server/.env` in VS Code e incolla i due valori al posto delle righe
`JWT_SECRET=cambiami...` e `IP_HASH_SALT=cambiami...`.
Nello stesso file cambia anche `ADMIN_PASSWORD` con la password che userai per entrare
nell'area riservata.

**2.4 — Installa le dipendenze e crea il database**

```bash
npm run setup
```

Questo comando fa tre cose: installa i pacchetti di frontend e backend, crea il database
SQLite con tutte le tabelle, e crea il primo account amministratore.
La prima volta ci mette qualche minuto.

---

## 3. Avviare il sito in locale (ogni volta)

```bash
cd ~/Documents/Web
```

```bash
npm run dev
```

Partono insieme frontend e backend. Nel terminale compaiono gli indirizzi:

| Cosa | Indirizzo |
| --- | --- |
| Sito | <http://localhost:5173> |
| Area riservata | <http://localhost:5173/admin> |
| Stato API | <http://localhost:4000/api/health> |

Le modifiche ai file si vedono subito nel browser, senza riavviare.

**Per fermare tutto:** clicca nel terminale e premi `Ctrl + C`.

---

## 4. Comandi di uso quotidiano

Tutti si lanciano da `~/Documents/Web`.

**Avviare il sito**

```bash
npm run dev
```

**Controllare che non ci siano errori TypeScript**

```bash
npm run typecheck
```

**Compilare per la pubblicazione**

```bash
npm run build
```

**Sfogliare il database in una finestra grafica** (si apre nel browser su `localhost:5555`)

```bash
npm run db:studio
```

**Svuotare il database e ricrearlo da zero** ⚠️ cancella tutti i dati

```bash
npm run db:reset
```

**Applicare una modifica fatta a `server/prisma/schema.prisma`**

```bash
npm run db:migrate --workspace=server
```

**Cancellare subito i dati scaduti** (di norma avviene da solo una volta al giorno)

```bash
npm run retention --workspace=server
```

**Reinstallare tutto da capo** se qualcosa si rompe

```bash
rm -rf node_modules client/node_modules server/node_modules
```

```bash
npm install
```

---

## 5. Se qualcosa non funziona

**`command not found: node` o `command not found: npm`**
Node non è installato o VS Code non ha ricaricato il PATH. Chiudi VS Code con ⌘Q,
riaprilo e riprova con `node -v`. Se persiste, rifai la sezione 1.

**`command not found: npm run ...` oppure `Missing script`**
Non sei nella cartella giusta. Controlla con:

```bash
pwd
```

Deve stampare `/Users/alessiodurbano/Documents/Web`.

**`Error: listen EADDRINUSE :::4000`**
La porta è già occupata da un'esecuzione precedente. Liberala:

```bash
lsof -ti:4000 | xargs kill -9
```

Stessa cosa per il frontend, cambiando la porta in `5173`.

**`Environment variable not found: DATABASE_URL`**
Manca il file `.env`. Rifai il punto 2.2 e poi:

```bash
npm run db:setup --workspace=server
```

**Il sito si apre ma i moduli danno errore di connessione**
Il backend non è partito. Guarda il terminale: se vedi errori solo sulla parte
`server`, avvialo da solo per leggere il messaggio completo:

```bash
npm run dev:server
```

**Le modifiche non si vedono nel browser**
Ricarica saltando la cache: **⌘ + Shift + R**.

---

## 6. Estensioni VS Code consigliate

Non sono obbligatorie, ma rendono il lavoro molto più comodo. Installale dalla barra
laterale *Extensions* cercando il nome, oppure da terminale:

```bash
code --install-extension dbaeumer.vscode-eslint
```

```bash
code --install-extension esbenp.prettier-vscode
```

```bash
code --install-extension Prisma.prisma
```

```bash
code --install-extension dsznajder.es7-react-js-snippets
```

Se `code` non è riconosciuto: apri VS Code, premi ⌘⇧P, scrivi
`Shell Command: Install 'code' command in PATH` e premi invio.

---

## 7. Struttura del progetto

```
Web/
├── client/                      frontend React + TypeScript
│   ├── src/
│   │   ├── components/          header, footer, banner cookie, mappa, icone
│   │   ├── context/             ConsentContext (cookie), AuthContext (admin)
│   │   ├── lib/                 client API, analytics, dati del negozio
│   │   ├── pages/               una pagina per rotta + area admin
│   │   ├── styles/global.css    stile unico, token del sito originale
│   │   └── types.ts             tipi condivisi
│   └── vite.config.ts
├── server/                      backend Express + TypeScript
│   ├── prisma/schema.prisma     modello dati
│   ├── src/lib/                 env, prisma, privacy, mailer, audit, retention
│   ├── src/middleware/          auth, upload CV, rate limit, errori
│   └── src/routes/              leads, applications, consents, admin
└── legacy/index.original.html   il sito single page di partenza
```

Il vecchio `index.html` è conservato in `legacy/index.original.html` come riferimento:
tutti i suoi contenuti sono stati riportati nelle pagine React.

### Pagine

| Rotta | Contenuto |
| --- | --- |
| `/` | hero, anteprima concept, anteprima store, richiamo al franchising |
| `/concept` | i valori del format e i quattro reparti |
| `/store` | dove siamo, orari, contatti, mappa |
| `/franchising` | vantaggi, percorso in 4 step, modulo di contatto |
| `/lavora-con-noi` | modulo di candidatura con upload del CV |
| `/contatti` | tutti i canali di contatto e mappa |
| `/privacy-policy` | informativa completa |
| `/cookie-policy` | dettaglio dei cookie e stato del consenso |
| `/admin` | area riservata protetta da login |

---

## 8. Il database

SQLite in locale (un file, zero installazione). Il passaggio a PostgreSQL in
produzione richiede solo di cambiare `provider` in `server/prisma/schema.prisma`
e `DATABASE_URL` nel `.env`: i modelli restano identici.

| Tabella | Cosa contiene |
| --- | --- |
| `FranchiseLead` | richieste di franchising, con stato, note interne e prova del consenso |
| `JobApplication` | candidature, con riferimento al CV su disco e stato della selezione |
| `CookieConsent` | registro delle scelte cookie, agganciato a un id anonimo del browser |
| `AdminUser` | account dello staff per l'area riservata |
| `AuditLog` | chi ha fatto cosa sui dati personali (accessi, esportazioni, cancellazioni) |

Scelte che vale la pena conoscere:

- **gli IP non sono mai in chiaro**: viene salvato solo un hash con chiave segreta,
  utile a riconoscere spam ma non a identificare la persona;
- **ogni record ha una data di scadenza** (`retentionUntil`): un processo giornaliero
  cancella automaticamente i dati scaduti, CV compresi;
- **i CV stanno su disco** in `server/uploads` con nome casuale; nel database restano
  solo i riferimenti, e il download passa dall'autenticazione admin;
- **il consenso è dimostrabile**: categoria per categoria, con versione dell'informativa
  e data.

I tempi di conservazione si regolano da `server/.env`
(`RETENTION_DAYS_LEADS`, `RETENTION_DAYS_APPLICATIONS`, `RETENTION_DAYS_CONSENTS`).

---

## 9. API

| Metodo | Endpoint | Descrizione |
| --- | --- | --- |
| `GET` | `/api/health` | stato del servizio |
| `POST` | `/api/franchise-leads` | invio richiesta franchising |
| `POST` | `/api/job-applications` | invio candidatura (multipart, campo `cv`) |
| `POST` | `/api/consents` | registrazione della scelta cookie |
| `POST` | `/api/admin/login` · `/logout` | autenticazione staff |
| `GET` | `/api/admin/me` · `/stats` | sessione corrente e contatori |
| `GET` | `/api/admin/leads` · `/applications` | elenchi con ricerca, filtro, paginazione |
| `PATCH` | `/api/admin/leads/:id` · `/applications/:id` | cambio stato e note |
| `DELETE` | `/api/admin/leads/:id` · `/applications/:id` | cancellazione |
| `GET` | `/api/admin/applications/:id/cv` | download del CV |
| `GET` | `/api/admin/export/*.csv` | esportazione per Excel |

Protezioni attive: `helmet`, CORS con lista di origini, rate limiting per rotta,
validazione con `zod`, campo esca anti-bot sui moduli, sessione in cookie `httpOnly`.

---

## 10. Cookie e GDPR

Il banner è scritto su misura, senza servizi esterni:

- niente si attiva prima della scelta — la mappa resta bloccata, nessuno script parte;
- **rifiutare costa un clic quanto accettare** (requisito su cui il Garante ha sanzionato più volte);
- nessuna categoria opzionale è pre-selezionata;
- la scelta è revocabile sempre, dal footer o dall'icona in basso a sinistra;
- ogni scelta viene registrata lato server con data e versione dell'informativa;
- se aggiorni le policy, alza `PRIVACY_VERSION` in `server/.env` **e** `POLICY_VERSION`
  in `client/src/context/ConsentContext.tsx`: il consenso verrà richiesto di nuovo a tutti.

### Da completare prima di pubblicare

Nelle pagine privacy e cookie policy i segnaposto sono **evidenziati in arancione**
(`[RAGIONE SOCIALE]`, `[PARTITA IVA]`, `[INDIRIZZO SEDE LEGALE]`, `[DATA DI PUBBLICAZIONE]`,
`[NOME FORNITORE HOSTING]`, `[NOME FORNITORE EMAIL]`). Vanno sostituiti con i dati reali:
si trovano in `client/src/pages/PrivacyPolicy.tsx` e `client/src/pages/CookiePolicy.tsx`.

Un punto ancora aperto: i **font sono caricati da Google Fonts**, quindi il browser
contatta un server Google prima di qualsiasi consenso. Un tribunale tedesco ha già
ritenuto questa pratica illegittima. La soluzione è ospitare i font sul proprio dominio:

```bash
npm install @fontsource/montserrat @fontsource/space-grotesk --workspace=client
```

Poi vanno importati in `client/src/main.tsx` e rimossi i `<link>` a Google in
`client/index.html`. È un intervento di dieci minuti che conviene fare prima della
pubblicazione.

---

## 11. Deploy

La build produce due artefatti: file statici (`client/dist`) e un server Node
(`server/dist`). Tre strade, in ordine di semplicità.

### A. Railway o Render — la più rapida

1. carica il progetto su un repository Git;
2. crea un servizio **PostgreSQL** gestito;
3. crea il servizio web con build `npm install && npm run build` e start `npm start`;
4. imposta le variabili d'ambiente prendendo `server/.env.example` come elenco;
5. in `server/prisma/schema.prisma` metti `provider = "postgresql"`, poi:

```bash
npm run db:deploy --workspace=server
```

Per servire il frontend dallo stesso servizio basta aggiungere a `server/src/app.ts`
la pubblicazione di `client/dist` con fallback su `index.html`. In alternativa metti
il frontend su Netlify/Vercel e punta le chiamate `/api` al backend.

**Attenzione ai CV:** su queste piattaforme il filesystem è effimero, i file caricati
spariscono a ogni riavvio. Serve uno storage a oggetti (S3, Cloudflare R2, Backblaze B2)
oppure un volume persistente.

### B. VPS (Hetzner, Aruba Cloud, DigitalOcean) — il controllo maggiore

Node + PostgreSQL sulla macchina, `pm2` per tenere vivo il processo, `nginx` davanti
come reverse proxy per `/api` e per i file statici, certificato TLS con Let's Encrypt,
backup giornaliero del database e della cartella `uploads`. È l'opzione che tiene i
dati interamente sotto il tuo controllo — coerente con quanto dichiarato in informativa.

### C. Hosting condiviso tradizionale

Sconsigliato: molti hosting italiani in abbonamento non eseguono Node.js. Se il
piano che hai già è di questo tipo, conviene valutare A o B.

### Lista di controllo prima di andare online

- [ ] `JWT_SECRET` e `IP_HASH_SALT` rigenerati (punto 2.3)
- [ ] password admin cambiata rispetto a quella di default
- [ ] `NODE_ENV=production` e `CLIENT_ORIGIN` con il dominio reale
- [ ] HTTPS attivo (i cookie di sessione sono `secure` in produzione)
- [ ] SMTP configurato, altrimenti le notifiche restano solo a console
- [ ] segnaposto legali sostituiti con i dati reali
- [ ] font self-hosted
- [ ] backup automatico di database e cartella `uploads`
- [ ] storage persistente per i CV se usi Railway/Render

---

## 12. Stato della verifica

Il progetto è stato installato ed eseguito con Node v24.19.0 e npm 11.17.0. Verificati:

- `npm install`, `npm run db:setup`, `npm run typecheck` e `npm run build` — tutti puliti;
- invio richiesta franchising e candidatura con CV, salvataggio a database;
- rifiuto dei dati non validi e della candidatura senza consenso privacy;
- rifiuto dei formati di file non ammessi;
- login admin, elenchi, download del CV, export CSV;
- blocco degli endpoint admin senza sessione;
- banner cookie: con «Rifiuta» la pagina non carica **nessun** iframe e **nessuno**
  script di statistica, e la scelta viene registrata a database;
- IP salvato solo come hash, data di scadenza calcolata sul record;
- layout senza scroll orizzontale a 375 px di larghezza;
- `npm audit`: **0 vulnerabilità** (react-router-dom portato a 7.x e nodemailer a 9.x
  per chiudere due advisory presenti nelle versioni iniziali).

### Nota su npm 11

npm 11 blocca per impostazione predefinita gli script di installazione dei pacchetti.
Prisma ed esbuild ne hanno bisogno, quindi sono stati autorizzati esplicitamente: la
lista si trova nel campo `allowScripts` del `package.json` di root. Se in futuro aggiungi
un pacchetto che richiede uno script di installazione, npm te lo segnala e lo autorizzi con:

```bash
npm approve-scripts <nome-pacchetto>
```
