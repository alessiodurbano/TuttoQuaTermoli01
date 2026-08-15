import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';
import type { AdminUser } from '../types';
import { apiGet, apiPost } from '../lib/api';
import { routes } from '../lib/site';

interface AuthContextValue {
  user: AdminUser | null;
  /** true finché non sappiamo se esiste una sessione valida. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();

  // La sessione vive in un cookie httpOnly: il solo modo di leggerla è chiedere
  // al server. Lo chiediamo però solo dentro l'area riservata: sulle pagine
  // pubbliche sarebbe una richiesta inutile che risponde sempre 401.
  const isAdminArea = pathname.startsWith(routes.admin);

  useEffect(() => {
    if (!isAdminArea) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    apiGet<{ user: AdminUser }>('/admin/me')
      .then((data) => {
        if (active) setUser(data.user);
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isAdminArea]);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiPost<{ user: AdminUser }>('/admin/login', { email, password });
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await apiPost('/admin/logout').catch(() => undefined);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth va usato dentro <AuthProvider>');
  }
  return context;
}
