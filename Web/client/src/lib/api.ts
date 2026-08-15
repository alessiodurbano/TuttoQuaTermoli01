/**
 * Client HTTP verso il backend. In sviluppo Vite inoltra `/api` a
 * localhost:4000; in produzione frontend e API stanno sullo stesso dominio,
 * quindi il percorso relativo funziona in entrambi i casi.
 */

export const API_BASE = '/api';

export class ApiError extends Error {
  readonly status: number;
  /** Errori di validazione per campo, restituiti da zod lato server. */
  readonly fields: Record<string, string>;

  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fields = fields;
  }
}

interface ApiErrorBody {
  error?: string;
  fields?: Record<string, string>;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body: unknown = isJson ? await response.json() : null;

  if (!response.ok) {
    const errorBody = (body ?? {}) as ApiErrorBody;
    throw new ApiError(
      errorBody.error ?? 'Qualcosa è andato storto. Riprova.',
      response.status,
      errorBody.fields ?? {},
    );
  }

  return body as T;
}

type Json = Record<string, unknown>;

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
  return parseResponse<T>(response);
}

export async function apiSend<T>(
  path: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: Json | FormData,
): Promise<T> {
  const isFormData = body instanceof FormData;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: 'include',
    // Con FormData il browser deve impostare da sé il boundary del multipart.
    headers: isFormData || !body ? undefined : { 'Content-Type': 'application/json' },
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  return parseResponse<T>(response);
}

export const apiPost = <T>(path: string, body?: Json | FormData): Promise<T> =>
  apiSend<T>(path, 'POST', body);

export const apiPatch = <T>(path: string, body: Json): Promise<T> =>
  apiSend<T>(path, 'PATCH', body);

export const apiDelete = <T>(path: string): Promise<T> => apiSend<T>(path, 'DELETE');
