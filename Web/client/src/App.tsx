import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ConsentProvider } from './context/ConsentContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { RequireAuth } from './pages/admin/RequireAuth';
import { routes } from './lib/site';
import Home from './pages/Home';

// Le pagine oltre la home si caricano al bisogno: la prima visita resta leggera.
const Concept = lazy(() => import('./pages/Concept'));
const Store = lazy(() => import('./pages/Store'));
const Franchising = lazy(() => import('./pages/Franchising'));
const Lavora = lazy(() => import('./pages/Lavora'));
const Contatti = lazy(() => import('./pages/Contatti'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

function PageFallback(): ReactNode {
  return (
    <div className="wrap" style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--ink-50)' }}>
      Caricamento…
    </div>
  );
}

export default function App(): ReactNode {
  return (
    <BrowserRouter>
      <ConsentProvider>
        <AuthProvider>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Sito pubblico: header, footer e banner cookie condivisi */}
              <Route element={<Layout />}>
                <Route path={routes.home} element={<Home />} />
                <Route path={routes.concept} element={<Concept />} />
                <Route path={routes.store} element={<Store />} />
                <Route path={routes.franchising} element={<Franchising />} />
                <Route path={routes.work} element={<Lavora />} />
                <Route path={routes.contacts} element={<Contatti />} />
                <Route path={routes.privacy} element={<PrivacyPolicy />} />
                <Route path={routes.cookies} element={<CookiePolicy />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Area riservata: layout autonomo, senza navigazione pubblica */}
              <Route path={routes.adminLogin} element={<AdminLogin />} />
              <Route
                path={routes.admin}
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
            </Routes>
          </Suspense>
        </AuthProvider>
      </ConsentProvider>
    </BrowserRouter>
  );
}
