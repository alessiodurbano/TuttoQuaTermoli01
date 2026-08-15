import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { site, mainNav, routes } from '../lib/site';
import { IconMenu, IconClose } from './Icons';

export function Header(): ReactNode {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === routes.home;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Cambio pagina: il menu mobile si richiude da solo.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Con il menu aperto la pagina sotto non deve scorrere.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // Fuori dalla home l'header è sempre opaco: sopra c'è testo, non l'immagine hero.
  const headerClass = ['site-header', scrolled ? 'scrolled' : '', isHome ? '' : 'solid']
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClass}>
      <nav aria-label="Navigazione principale">
        <Link to={routes.home} className="logo">
          <img src={site.logo} alt="" width={40} height={40} />
          <span>{site.name}</span>
        </Link>

        <div className="nav-links">
          {mainNav.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-right">
          <Link to={routes.franchising} className="nav-cta">
            Apri TuttoQua
          </Link>
          <button
            type="button"
            className="menu-btn"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Chiudi il menu' : 'Apri il menu'}
          >
            {menuOpen ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu" id="mobile-menu">
          {mainNav.map((item) => (
            <NavLink key={item.to} to={item.to}>
              {item.label}
            </NavLink>
          ))}
          <Link to={routes.franchising} className="cta">
            Apri TuttoQua
          </Link>
        </div>
      )}
    </header>
  );
}
