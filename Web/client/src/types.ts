/** Tipi condivisi fra le pagine pubbliche e l'area admin. */

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'won' | 'lost';
export type ApplicationStatus = 'new' | 'reviewing' | 'interview' | 'hired' | 'rejected';
export type Personality = 'Creativo' | 'Risolutore' | 'People person';

export interface FranchiseLead {
  id: string;
  name: string;
  email: string;
  city: string;
  phone: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string | null;
  message: string | null;
  personality: Personality | null;
  cvOriginalName: string | null;
  cvSizeBytes: number | null;
  status: ApplicationStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export interface AdminStats {
  leads: { total: number; new: number; last7Days: number };
  applications: { total: number; new: number; last7Days: number };
  consents: { total: number };
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

/** Preferenze cookie del visitatore. `necessary` è sempre attivo. */
export interface ConsentPreferences {
  necessary: true;
  functional: boolean;
  analytics: boolean;
}

export type ConsentAction = 'accept_all' | 'reject_all' | 'custom' | 'withdraw';

export interface StoredConsent extends ConsentPreferences {
  visitorId: string;
  action: ConsentAction;
  policyVersion: string;
  decidedAt: string;
}
