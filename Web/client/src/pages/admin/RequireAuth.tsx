import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { routes } from '../../lib/site';

/** Protegge le rotte admin: senza sessione valida rimanda al login. */
export function RequireAuth({ children }: { children: ReactNode }): ReactNode {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p className="empty-state" style={{ paddingTop: '25vh' }}>Verifica della sessione…</p>;
  }

  if (!user) {
    return <Navigate to={routes.adminLogin} state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
