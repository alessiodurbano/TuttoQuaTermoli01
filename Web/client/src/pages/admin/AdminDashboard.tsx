import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDocumentMeta } from '../../lib/useDocumentMeta';
import { apiGet, apiPatch, apiDelete, API_BASE } from '../../lib/api';
import { site } from '../../lib/site';
import type {
  AdminStats,
  ApplicationStatus,
  FranchiseLead,
  JobApplication,
  LeadStatus,
  Paginated,
} from '../../types';

const LEAD_STATUSES: { value: LeadStatus; label: string }[] = [
  { value: 'new', label: 'Nuovo' },
  { value: 'contacted', label: 'Contattato' },
  { value: 'qualified', label: 'In valutazione' },
  { value: 'won', label: 'Chiuso positivo' },
  { value: 'lost', label: 'Chiuso negativo' },
];

const APPLICATION_STATUSES: { value: ApplicationStatus; label: string }[] = [
  { value: 'new', label: 'Nuova' },
  { value: 'reviewing', label: 'In lettura' },
  { value: 'interview', label: 'Colloquio' },
  { value: 'hired', label: 'Assunto' },
  { value: 'rejected', label: 'Non idoneo' },
];

const PER_PAGE = 25;

type Tab = 'leads' | 'applications';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function StatusPill({ status, label }: { status: string; label: string }): ReactNode {
  return <span className={`pill pill-${status}`}>{label}</span>;
}

export default function AdminDashboard(): ReactNode {
  useDocumentMeta('Gestione — TuttoQua');

  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('leads');
  const [stats, setStats] = useState<AdminStats | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [leads, setLeads] = useState<Paginated<FranchiseLead> | null>(null);
  const [applications, setApplications] = useState<Paginated<JobApplication> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = useCallback(() => {
    apiGet<AdminStats>('/admin/stats')
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  const loadList = useCallback(async () => {
    setLoading(true);
    setError('');

    const params = new URLSearchParams({ page: String(page), perPage: String(PER_PAGE) });
    if (query.trim()) params.set('q', query.trim());
    if (statusFilter) params.set('status', statusFilter);

    try {
      if (tab === 'leads') {
        setLeads(await apiGet<Paginated<FranchiseLead>>(`/admin/leads?${params}`));
      } else {
        setApplications(await apiGet<Paginated<JobApplication>>(`/admin/applications?${params}`));
      }
    } catch {
      setError('Caricamento non riuscito. Ricarica la pagina.');
    } finally {
      setLoading(false);
    }
  }, [tab, page, query, statusFilter]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // La ricerca parte 300ms dopo l'ultima battitura, non a ogni tasto.
  useEffect(() => {
    const timer = setTimeout(() => void loadList(), 300);
    return () => clearTimeout(timer);
  }, [loadList]);

  // Cambiando scheda o filtro si riparte dalla prima pagina.
  useEffect(() => {
    setPage(1);
  }, [tab, query, statusFilter]);

  async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
    setLeads((current) =>
      current
        ? { ...current, items: current.items.map((l) => (l.id === id ? { ...l, status } : l)) }
        : current,
    );
    await apiPatch(`/admin/leads/${id}`, { status });
    loadStats();
  }

  async function updateApplicationStatus(id: string, status: ApplicationStatus): Promise<void> {
    setApplications((current) =>
      current
        ? { ...current, items: current.items.map((a) => (a.id === id ? { ...a, status } : a)) }
        : current,
    );
    await apiPatch(`/admin/applications/${id}`, { status });
    loadStats();
  }

  async function remove(kind: Tab, id: string, who: string): Promise<void> {
    const label = kind === 'leads' ? 'la richiesta' : 'la candidatura';
    if (!window.confirm(`Eliminare definitivamente ${label} di ${who}? L'operazione è irreversibile.`)) {
      return;
    }

    await apiDelete(`/admin/${kind === 'leads' ? 'leads' : 'applications'}/${id}`);
    await loadList();
    loadStats();
  }

  const statuses = tab === 'leads' ? LEAD_STATUSES : APPLICATION_STATUSES;
  const total = tab === 'leads' ? leads?.total ?? 0 : applications?.total ?? 0;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <div className="admin-shell">
      <div className="admin-topbar">
        <div className="brand">
          <img src={site.logo} alt="" />
          <span>TuttoQua · gestione</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="who">{user?.email}</span>
          <button type="button" className="admin-logout" onClick={() => void logout()}>
            Esci
          </button>
        </div>
      </div>

      <div className="admin-body">
        <div className="stat-grid">
          <div className="stat">
            <p className="label">Richieste franchising</p>
            <p className="value">{stats?.leads.total ?? '—'}</p>
            <p className="sub">{stats?.leads.new ?? 0} da lavorare</p>
          </div>
          <div className="stat">
            <p className="label">Candidature</p>
            <p className="value">{stats?.applications.total ?? '—'}</p>
            <p className="sub">{stats?.applications.new ?? 0} da leggere</p>
          </div>
          <div className="stat">
            <p className="label">Ultimi 7 giorni</p>
            <p className="value">
              {(stats?.leads.last7Days ?? 0) + (stats?.applications.last7Days ?? 0)}
            </p>
            <p className="sub">nuovi contatti totali</p>
          </div>
          <div className="stat">
            <p className="label">Consensi cookie</p>
            <p className="value">{stats?.consents.total ?? '—'}</p>
            <p className="sub">scelte registrate</p>
          </div>
        </div>

        <div className="admin-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'leads'}
            className={`admin-tab ${tab === 'leads' ? 'active' : ''}`}
            onClick={() => setTab('leads')}
          >
            Richieste franchising
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'applications'}
            className={`admin-tab ${tab === 'applications' ? 'active' : ''}`}
            onClick={() => setTab('applications')}
          >
            Candidature
          </button>
        </div>

        <div className="admin-toolbar">
          <input
            type="search"
            placeholder={tab === 'leads' ? 'Cerca nome, email, città…' : 'Cerca nome, email, ruolo…'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Cerca"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filtra per stato"
          >
            <option value="">Tutti gli stati</option>
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <a
            className="btn btn-ghost"
            href={`${API_BASE}/admin/export/${tab === 'leads' ? 'leads' : 'applications'}.csv`}
          >
            Esporta CSV
          </a>
        </div>

        {error && <div className="alert err" style={{ marginTop: '1rem' }}>⚠ {error}</div>}

        <div className="table-wrap">
          {loading ? (
            <p className="empty-state">Caricamento…</p>
          ) : tab === 'leads' ? (
            !leads?.items.length ? (
              <p className="empty-state">Nessuna richiesta trovata.</p>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Contatti</th>
                    <th>Città</th>
                    <th>Messaggio</th>
                    <th>Stato</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {leads.items.map((lead) => (
                    <tr key={lead.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{formatDate(lead.createdAt)}</td>
                      <td>
                        <strong>{lead.name}</strong>
                        <br />
                        <StatusPill
                          status={lead.status}
                          label={
                            LEAD_STATUSES.find((s) => s.value === lead.status)?.label ?? lead.status
                          }
                        />
                      </td>
                      <td>
                        <a href={`mailto:${lead.email}`}>{lead.email}</a>
                        {lead.phone && (
                          <>
                            <br />
                            <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                          </>
                        )}
                      </td>
                      <td>{lead.city}</td>
                      <td style={{ maxWidth: '18rem' }}>{lead.message ?? '—'}</td>
                      <td>
                        <select
                          value={lead.status}
                          onChange={(e) =>
                            void updateLeadStatus(lead.id, e.target.value as LeadStatus)
                          }
                          aria-label={`Stato della richiesta di ${lead.name}`}
                        >
                          {LEAD_STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="link-btn danger"
                          onClick={() => void remove('leads', lead.id, lead.name)}
                        >
                          Elimina
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : !applications?.items.length ? (
            <p className="empty-state">Nessuna candidatura trovata.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Nome</th>
                  <th>Contatti</th>
                  <th>Posizione</th>
                  <th>CV</th>
                  <th>Stato</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {applications.items.map((application) => (
                  <tr key={application.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{formatDate(application.createdAt)}</td>
                    <td>
                      <strong>{application.name}</strong>
                      <br />
                      <StatusPill
                        status={application.status}
                        label={
                          APPLICATION_STATUSES.find((s) => s.value === application.status)?.label ??
                          application.status
                        }
                      />
                      {application.personality && (
                        <>
                          <br />
                          <span style={{ fontSize: '0.75rem', color: 'var(--ink-50)' }}>
                            {application.personality}
                          </span>
                        </>
                      )}
                    </td>
                    <td>
                      <a href={`mailto:${application.email}`}>{application.email}</a>
                      {application.phone && (
                        <>
                          <br />
                          <a href={`tel:${application.phone}`}>{application.phone}</a>
                        </>
                      )}
                    </td>
                    <td>{application.role ?? '—'}</td>
                    <td>
                      {application.cvOriginalName ? (
                        <a href={`${API_BASE}/admin/applications/${application.id}/cv`}>
                          Scarica ↓
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td>
                      <select
                        value={application.status}
                        onChange={(e) =>
                          void updateApplicationStatus(
                            application.id,
                            e.target.value as ApplicationStatus,
                          )
                        }
                        aria-label={`Stato della candidatura di ${application.name}`}
                      >
                        {APPLICATION_STATUSES.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="link-btn danger"
                        onClick={() =>
                          void remove('applications', application.id, application.name)
                        }
                      >
                        Elimina
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {lastPage > 1 && (
          <div className="pagination">
            <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
              ← Precedente
            </button>
            <span>
              Pagina {page} di {lastPage} · {total} record
            </span>
            <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= lastPage}>
              Successiva →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
