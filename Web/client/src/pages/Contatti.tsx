import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';
import { MapEmbed } from '../components/MapEmbed';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { site, routes } from '../lib/site';
import {
  IconPin,
  IconClock,
  IconPhone,
  IconMail,
  IconInstagram,
  IconFacebook,
} from '../components/Icons';

export default function Contatti(): ReactNode {
  useDocumentMeta(
    'Contatti — TuttoQua Termoli',
    'Telefono, email e indirizzo del negozio TuttoQua a Termoli (CB).',
  );

  return (
    <>
      <PageHero
        breadcrumb="Contatti"
        eyebrow="contatti"
        title={
          <>
            Parliamone: <span className="hl">siamo qua.</span>
          </>
        }
        lead="Per informazioni sul negozio, sul franchising o per candidarti, scegli il canale che preferisci."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="value-grid">
            <article className="value-card">
              <span className="ic ic-blue">
                <IconPhone />
              </span>
              <h3>Telefono</h3>
              <p>
                <a href={site.phoneHref}>{site.phone}</a>
                <br />
                {site.hours}
              </p>
            </article>

            <article className="value-card">
              <span className="ic ic-orange">
                <IconMail />
              </span>
              <h3>Email</h3>
              <p>
                Informazioni: <a href={`mailto:${site.email}`}>{site.email}</a>
                <br />
                Franchising:{' '}
                <a href={`mailto:${site.franchisingEmail}`}>{site.franchisingEmail}</a>
                <br />
                Privacy: <a href={`mailto:${site.privacyEmail}`}>{site.privacyEmail}</a>
              </p>
            </article>

            <article className="value-card">
              <span className="ic ic-lemon">
                <IconPin />
              </span>
              <h3>Negozio</h3>
              <p>
                {site.city}
                <br />
                {site.address}
              </p>
            </article>
          </div>

          <div className="value-grid" style={{ marginTop: '1rem' }}>
            <article className="value-card">
              <span className="ic ic-pink">
                <IconClock />
              </span>
              <h3>Orari</h3>
              <p>{site.hours}</p>
              <p style={{ fontSize: '0.8125rem' }}>
                Il punto vendita è in fase di apertura: gli orari definitivi saranno pubblicati qui.
              </p>
            </article>

            <article className="value-card">
              <span className="ic ic-blue">
                <IconInstagram />
              </span>
              <h3>Social</h3>
              <p style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <IconInstagram style={{ width: '1.1rem', height: '1.1rem' }} /> Instagram
                </a>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  <IconFacebook style={{ width: '1.1rem', height: '1.1rem' }} /> Facebook
                </a>
              </p>
            </article>

            <article className="value-card">
              <span className="ic ic-orange">
                <IconMail />
              </span>
              <h3>Scrivici un messaggio</h3>
              <p>
                Vuoi aprire un TuttoQua o candidarti? Usa i moduli dedicati: arrivano direttamente a
                chi se ne occupa.
              </p>
              <p style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                <Link to={routes.franchising} className="btn btn-primary">
                  Franchising
                </Link>
                <Link to={routes.work} className="btn btn-ghost">
                  Candidati
                </Link>
              </p>
            </article>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <MapEmbed />
          </div>
        </div>
      </section>
    </>
  );
}
