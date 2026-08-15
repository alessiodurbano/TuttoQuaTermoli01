import { useEffect, type ReactNode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { CookieBanner } from './CookieBanner';
import { useConsent } from '../context/ConsentContext';
import { trackPageView } from '../lib/analytics';

/**
 * In una SPA il cambio pagina non ricarica il documento: riportiamo noi la
 * pagina in cima e annunciamo la navigazione agli screen reader.
 */
function useRouteEffects(): void {
  const { pathname } = useLocation();
  const { preferences } = useConsent();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  useEffect(() => {
    if (preferences.analytics) trackPageView(pathname);
  }, [pathname, preferences.analytics]);
}

export function Layout(): ReactNode {
  useRouteEffects();

  return (
    <>
      <a href="#contenuto" className="skip-link">
        Salta al contenuto
      </a>
      <Header />
      <main id="contenuto" className="page-main">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
