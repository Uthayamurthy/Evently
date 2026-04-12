const API_BASE = 'http://localhost:8080/api';

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
    register: async (data: any) => {
      const response = await fetch(`${API_BASE}/student/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE}/student/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ emailId: email, password }),
      });
      return response.json();
    },
  },

  faculty: {
    register: async (data: any) => {
      const response = await fetch(`${API_BASE}/faculty/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_BASE}/faculty/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ emailId: email, password }),
      });
      return response.json();
    },
  },

  events: {
    getVerified: async () => {
      const response = await fetch(`${API_BASE}/events/verified`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    create: async (event: any) => {
      const response = await fetch(`${API_BASE}/events`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(event),
      });
      return response.json();
    },
  },

  od: {
    apply: async (data: any) => {
      const response = await fetch(`${API_BASE}/od/apply`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      return response.json();
    },
    getPending: async () => {
      const response = await fetch(`${API_BASE}/od/pending`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    approve: async (id: string) => {
      const response = await fetch(`${API_BASE}/od/approve/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    reject: async (id: string) => {
      const response = await fetch(`${API_BASE}/od/reject/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({}),
      });
      return response.json();
    },
    getByMonth: async (year: number, month: number) => {
      const response = await fetch(`${API_BASE}/od/by-month?year=${year}&month=${month}`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
    getMyODs: async () => {
      const response = await fetch(`${API_BASE}/od/my-ods`, {
        headers: getAuthHeaders(),
      });
      return response.json();
    },
  },
};