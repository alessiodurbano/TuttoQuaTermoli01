import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site, routes } from '../lib/site';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { CATEGORIES } from '../lib/content';
import { IconPin, IconClock, IconPhone, IconSparkle } from '../components/Icons';

export default function Home(): ReactNode {
  useDocumentMeta(
    'TuttoQua — Tutto quello che cerchi, Tutto Qua. | Termoli',
    'TuttoQua è il nuovo negozio di Termoli: casa, pulizia, giochi e regali a portata di mano.',
  );

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="hero-grid">
            <div className="hero-text">
              <span className="badge">
                <span className="dot" />
                <span>Presto a Termoli</span>
              </span>
              <h1>
                Tutto quello che cerchi, <span className="hl">Tutto Qua.</span>
              </h1>
              <p className="lead">
                Arriva a Termoli (CB) il primo negozio targato TuttoQua. Un luogo dove la cura della
                persona, della casa e dei bambini è al primo posto con prezzi accessibili e prodotti
                di cui non sapevi di aver bisogno.
              </p>
              <div className="hero-cta">
                <Link to={routes.concept} className="btn btn-primary">
                  Scopri il concept →
                </Link>
                <Link to={routes.franchising} className="btn btn-ghost">
                  📍 Apri con noi
                </Link>
              </div>
            </div>

            <div className="hero-img-wrap">
              <div className="hero-img-box">
                <img src={site.images.hero} alt="Una selezione di oggetti colorati di TuttoQua" />
              </div>
              <IconSparkle className="star-doodle" />
              <span className="hero-tag">Il primo store in Molise</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div style={{ maxWidth: '36rem' }}>
            <span className="eyebrow">il concept</span>
            <h2 style={{ marginTop: '0.75rem' }}>
              Un mondo di cose utili — <span className="hl">e curiose.</span>
            </h2>
            <p className="section-lead">
              TuttoQua rende accessibile il bello e l&apos;utile, ogni giorno. Oggettistica per la
              casa, prodotti per la pulizia, giochi, regali e cancelleria — scelti uno per uno, a
              prezzi onesti.
            </p>
          </div>

          <div className="cats">
            {CATEGORIES.map(({ label, tone, Icon }) => (
              <div className="cat" key={label}>
                <span className={`ic ic-${tone}`}>
                  <Icon />
                </span>
                <p>{label}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <Link to={routes.concept} className="btn btn-dark">
              Tutto il concept →
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="loc-grid">
            <div className="loc-photo">
              <div className="box">
                <img
                  src={site.images.store}
                  alt="Vetrina del negozio TuttoQua a Termoli"
                  loading="lazy"
                />
              </div>
              <span className="pin">{site.city}</span>
            </div>

            <div className="loc-info">
              <h2>
                Vieni a trovarci a <span className="hl">Termoli.</span>
              </h2>
              <p className="lead">Ci stai ancora pensando?! Cosa aspetti, vieni a trovarci!</p>

              <div className="loc-list">
                <div className="loc-row">
                  <span className="ic ic-blue">
                    <IconPin />
                  </span>
                  <div>
                    <p className="lbl">Indirizzo</p>
                    <p className="val">{site.city}</p>
                  </div>
                </div>
                <div className="loc-row">
                  <span className="ic ic-orange">
                    <IconClock />
                  </span>
                  <div>
                    <p className="lbl">Orari</p>
                    <p className="val">In fase di apertura</p>
                  </div>
                </div>
                <div className="loc-row">
                  <span className="ic ic-lemon">
                    <IconPhone />
                  </span>
                  <div>
                    <p className="lbl">Chiamaci</p>
                    <p className="val">
                      <a href={site.phoneHref}>{site.phone}</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="loc-cta">
                <Link to={routes.store} className="btn btn-primary">
                  Scopri lo store →
                </Link>
                <Link to={routes.contacts} className="btn btn-ghost">
                  Contattaci
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="cta-band">
            <h2>
              Apri <span style={{ color: 'var(--orange)' }}>TuttoQua</span> nella tua città
            </h2>
            <p>
              Un format giovane e dinamico in continua crescita. Ti accompagniamo dalla scelta della
              location fino allo scaffale, step by step.
            </p>
            <div className="actions">
              <Link to={routes.franchising} className="btn btn-orange">
                Scopri il franchising →
              </Link>
              <Link to={routes.work} className="btn btn-ghost">
                Lavora con noi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
