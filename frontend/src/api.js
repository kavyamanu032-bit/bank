const API = import.meta.env.VITE_API_URL || '/api';

export async function register({ customer_name, email, password }) {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ customer_name, email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login({ email, password }) {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function logout() {
  await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
}

export async function getMe() {
  const res = await fetch(`${API}/me`, { credentials: 'include' });
  if (!res.ok) return null;
  return res.json();
}

export async function getBalance() {
  const res = await fetch(`${API}/balance`, { credentials: 'include' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch balance');
  return data;
}

export async function transfer({ recipient_email, amount }) {
  const res = await fetch(`${API}/transfer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ recipient_email, amount: Number(amount) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Transfer failed');
  return data;
}

export async function getCustomers() {
  const res = await fetch(`${API}/customers`, { credentials: 'include' });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Failed to fetch customers');
  return data;
}
