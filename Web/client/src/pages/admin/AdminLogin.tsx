import { useState, type FormEvent, type ReactNode } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { ApiError } from '../../lib/api';
import { site, routes } from '../../lib/site';

export default function AdminLogin(): ReactNode {
  useDocumentMeta('Area riservata — TuttoQua');

  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={routes.admin} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(email, password);
      navigate(routes.admin, { replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Connessione non riuscita. Riprova tra poco.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="card" onSubmit={handleSubmit}>
        <div style={{ textAlign: 'center' }}>
          <img
            src={site.logo}
            alt=""
            width={56}
            height={56}
            style={{ borderRadius: '1rem', margin: '0 auto 0.75rem' }}
          />
          <h1 style={{ fontSize: '1.375rem' }}>Area riservata</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--ink-50)', marginTop: '0.25rem' }}>
            Gestione richieste e candidature
          </p>
        </div>

        <label className="field">
          <span className="lbl">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="field">
          <span className="lbl">Password</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button type="submit" className="btn-submit" disabled={submitting}>
          {submitting ? 'Accesso…' : 'Accedi'}
        </button>

        <div aria-live="polite">{error && <div className="alert err">⚠ {error}</div>}</div>
      </form>
    </div>
  );
}
