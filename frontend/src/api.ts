import type { Event, Faculty, LoginResponse, ODRequest, Student } from './types';

const API_BASE = (import.meta.env.VITE_API_BASE || '/api').replace(/\/$/, '');

type ApiMessage = {
  message: string;
};

async function parseResponseBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.parse(text);
  }

  return text;
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === 'object' && 'message' in payload) {
    const message = payload.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (typeof payload === 'string' && payload.trim()) {
    return payload;
  }

  return fallback;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  const payload = await parseResponseBody(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(payload, `Request failed with status ${response.status}`));
  }

  return payload as T;
}

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('role');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(userId ? { 'X-User-Id': userId } : {}),
    ...(userRole ? { 'X-User-Role': userRole } : {}),
  };
}

export const api = {
  student: {
    register: async (data: Student) =>
      request<Student>('/student/register', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }),
    login: async (email: string, password: string) =>
      request<LoginResponse>('/student/login', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ emailId: email, password }),
      }),
  },

  faculty: {
    register: async (data: Faculty) =>
      request<Faculty>('/faculty/register', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      }),
    login: async (email: string, password: string) =>
      request<LoginResponse>('/faculty/login', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ emailId: email, password }),
      }),
  },

  events: {
    getVerified: async () =>
      request<Event[]>('/events/verified', {
        headers: getAuthHeaders(),
      }),
    create: async (event: Event | Record<string, unknown>) =>
      request<Event>('/events', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(event),
      }),
  },

  od: {
    apply: async (data: Record<string, unknown>) =>
      request<ODRequest>('/od/apply', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      }),
    getPending: async () =>
      request<ODRequest[]>('/od/pending', {
        headers: getAuthHeaders(),
      }),
    approve: async (id: string) =>
      request<ApiMessage | null>(`/od/approve/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      }),
    reject: async (id: string) =>
      request<ApiMessage | null>(`/od/reject/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      }),
    getByMonth: async (year: number, month: number) =>
      request<ODRequest[]>(`/od/by-month?year=${year}&month=${month}`, {
        headers: getAuthHeaders(),
      }),
    getMyODs: async () =>
      request<ODRequest[]>('/od/my-ods', {
        headers: getAuthHeaders(),
      }),
  },
};
