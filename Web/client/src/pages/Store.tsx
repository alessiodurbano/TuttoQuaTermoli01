import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { MapEmbed } from '../components/MapEmbed';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { site, routes } from '../lib/site';
import { IconPin, IconClock, IconPhone, IconMail } from '../components/Icons';

export default function Store(): ReactNode {
  useDocumentMeta(
    'Lo store di Termoli — TuttoQua',
    'Dove siamo, orari e contatti del negozio TuttoQua a Termoli (CB).',
  );

  return (
    <>
      <PageHero
        breadcrumb="Lo store"
        eyebrow="lo store"
        title={
          <>
            Vieni a trovarci a <span className="hl">Termoli.</span>
          </>
        }
        lead="Ci stai ancora pensando?! Cosa aspetti, vieni a trovarci!"
      />

      <section className="section" style={{ paddingTop: 0 }}>
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
              <h2>Dove siamo</h2>
              <p className="lead">
                Il punto vendita è in fase di apertura: l’indirizzo esatto sarà pubblicato qui non
                appena definito. Nel frattempo puoi chiamarci o scriverci.
              </p>

              <div className="loc-list">
                <div className="loc-row">
                  <span className="ic ic-blue">
                    <IconPin />
                  </span>
                  <div>
                    <p className="lbl">Indirizzo</p>
                    <p className="val">
                      {site.city} — {site.address}
                    </p>
                  </div>
                </div>
                <div className="loc-row">
                  <span className="ic ic-orange">
                    <IconClock />
                  </span>
                  <div>
                    <p className="lbl">Orari</p>
                    <p className="val">{site.hours}</p>
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
                <div className="loc-row">
                  <span className="ic ic-pink">
                    <IconMail />
                  </span>
                  <div>
                    <p className="lbl">Scrivici</p>
                    <p className="val">
                      <a href={`mailto:${site.email}`}>{site.email}</a>
                    </p>
                  </div>
                </div>
              </div>

              <div className="loc-cta">
                <a
                  href={site.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Siamo a Termoli! ↗
                </a>
                <Link to={routes.contacts} className="btn btn-ghost">
                  Tutti i contatti
                </Link>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <MapEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
