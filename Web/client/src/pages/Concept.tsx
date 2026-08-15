import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { site, routes } from '../lib/site';
import { CATEGORIES } from '../lib/content';
import { IconHeart, IconTrend, IconBox } from '../components/Icons';

const VALUES = [
  {
    Icon: IconHeart,
    tone: 'ic-pink',
    title: 'Prezzi onesti',
    text: 'Un assortimento pensato per la spesa quotidiana, con prezzi chiari e accessibili a tutti.',
  },
  {
    Icon: IconBox,
    tone: 'ic-blue',
    title: 'Scelti uno per uno',
    text: 'Ogni referenza entra a scaffale solo se è utile, se dura e se ha senso al suo prezzo.',
  },
  {
    Icon: IconTrend,
    tone: 'ic-lemon',
    title: 'Sempre qualcosa di nuovo',
    text: 'Il catalogo si aggiorna di continuo: entri per una cosa ed esci con quella che non sapevi di cercare.',
  },
];

export default function Concept(): ReactNode {
  useDocumentMeta(
    'Il concept — TuttoQua Termoli',
    'Casalinghi, pulizia, giocattoli e cartoleria: come nasce l’assortimento TuttoQua e cosa trovi in negozio.',
  );

  return (
    <>
      <PageHero
        breadcrumb="Concept"
        eyebrow="il concept"
        title={
          <>
            Un mondo di cose utili — <span className="hl">e curiose.</span>
          </>
        }
        lead="TuttoQua rende accessibile il bello e l’utile, ogni giorno. Oggettistica per la casa, prodotti per la pulizia, giochi, regali e cancelleria — scelti uno per uno, a prezzi onesti."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="value-grid">
            {VALUES.map(({ Icon, tone, title, text }) => (
              <article className="value-card" key={title}>
                <span className={`ic ${tone}`}>
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div style={{ maxWidth: '36rem' }}>
            <span className="eyebrow">i reparti</span>
            <h2 style={{ marginTop: '0.75rem' }}>Cosa trovi a scaffale</h2>
            <p className="section-lead">
              Quattro mondi, un solo negozio. Entri per la spesa di casa e finisci per trovare il
              regalo giusto.
            </p>
          </div>

          <div className="value-grid">
            {CATEGORIES.map(({ label, tone, Icon, description }) => (
              <article className="value-card" key={label}>
                <span className={`ic ic-${tone}`}>
                  <Icon />
                </span>
                <h3>{label}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="loc-grid">
            <div className="loc-photo">
              <div className="box">
                <img src={site.images.hero} alt="Prodotti TuttoQua" loading="lazy" />
              </div>
            </div>
            <div className="loc-info">
              <h2>
                Il primo store <span className="hl">in Molise.</span>
              </h2>
              <p className="lead">
                Partiamo da Termoli, ma il format è pensato per crescere: assortimento pronto,
                fornitura continua e un marchio che si riconosce a colpo d’occhio.
              </p>
              <div className="loc-cta">
                <Link to={routes.store} className="btn btn-primary">
                  Vieni a trovarci →
                </Link>
                <Link to={routes.franchising} className="btn btn-ghost">
                  Aprine uno tu
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
