const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiErrorBody {
  error?: { message?: string };
}

export const apiRequest = async <T = unknown>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

  const token = typeof window === 'undefined' ? null : localStorage.getItem('hl_auth_token');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const body = payload as ApiErrorBody | null;
    throw new Error(body?.error?.message || `Request failed (${response.status})`);
  }
  return payload as T;
};