import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../lib/useDocumentMeta';
import { routes } from '../lib/site';

export default function NotFound(): ReactNode {
  useDocumentMeta('Pagina non trovata — TuttoQua');

  return (
    <section className="notfound">
      <div className="wrap">
        <p className="code">404</p>
        <h1>Questa proprio non ce l’abbiamo.</h1>
        <p>
          La pagina che cercavi non esiste o è stata spostata. Torna in home o dai un’occhiata al
          negozio.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to={routes.home} className="btn btn-primary">
            Torna alla home
          </Link>
          <Link to={routes.store} className="btn btn-ghost">
            Lo store
          </Link>
        </div>
      </div>
    </section>
  );
}
