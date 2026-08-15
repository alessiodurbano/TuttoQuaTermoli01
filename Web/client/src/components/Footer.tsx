import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { site, routes } from '../lib/site';
import { useConsent } from '../context/ConsentContext';
import {
  IconInstagram,
  IconFacebook,
  IconPin,
  IconClock,
  IconMail,
  IconPhone,
} from './Icons';

export function Footer(): ReactNode {
  const { openPanel } = useConsent();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <div className="lockup">
              <span className="ic">
                <img src={site.logo} alt="" />
              </span>
              <b>{site.name}</b>
            </div>
            <p>
              Tutto quello che cerchi, proprio Qua. Il nuovo concept store di Termoli — e presto,
              nella tua città.
            </p>
            <div className="foot-social">
              <a
                href={site.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram di TuttoQua"
              >
                <IconInstagram />
              </a>
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook di TuttoQua"
              >
                <IconFacebook />
              </a>
            </div>
          </div>

          <div className="foot-col">
            <h3>Contatti</h3>
            <ul>
              <li>
                <IconPin />
                <span>
                  {site.city}
                  <br />
                  {site.address}
                </span>
              </li>
              <li>
                <IconClock />
                <span>{site.hours}</span>
              </li>
              <li>
                <IconPhone />
                <a href={site.phoneHref}>{site.phone}</a>
              </li>
              <li>
                <IconMail />
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h3>Esplora</h3>
            <ul>
              <li>
                <Link to={routes.concept}>Concept</Link>
              </li>
              <li>
                <Link to={routes.store}>Lo store</Link>
              </li>
              <li>
                <Link to={routes.franchising}>Franchising</Link>
              </li>
              <li>
                <Link to={routes.work}>Lavora con noi</Link>
              </li>
            </ul>
          </div>

          <div className="foot-col">
            <h3>Legale</h3>
            <ul>
              <li>
                <Link to={routes.privacy}>Privacy policy</Link>
              </li>
              <li>
                <Link to={routes.cookies}>Cookie policy</Link>
              </li>
              <li>
                <button type="button" className="cookie-settings-link" onClick={openPanel}>
                  Preferenze cookie
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="foot-bottom">
          <p>
            © {year} {site.name} · {site.city} · {site.vat}
          </p>
          <div className="made">Made with ❤️ da Alessio D.</div>
        </div>
      </div>
    </footer>
  );
}
