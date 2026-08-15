import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../lib/site';

interface PageHeroProps {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Etichetta della pagina corrente nel percorso di navigazione. */
  breadcrumb: string;
  children?: ReactNode;
}

/** Intestazione comune a tutte le pagine interne. */
export function PageHero({ eyebrow, title, lead, breadcrumb, children }: PageHeroProps): ReactNode {
  return (
    <section className="page-hero">
      <div className="wrap">
        <nav className="breadcrumb" aria-label="Percorso di navigazione">
          <Link to={routes.home}>Home</Link> <span aria-hidden>/</span> {breadcrumb}
        </nav>
        <span className="eyebrow" style={{ display: 'block', marginTop: '1rem' }}>
          {eyebrow}
        </span>
        <h1>{title}</h1>
        {lead && <p className="section-lead">{lead}</p>}
        {children}
      </div>
    </section>
  );
}
