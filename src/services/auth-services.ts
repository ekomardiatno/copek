import { WEB_API_URL } from '../config';

export const login = async (
  payload: {
    userPhone: string;
    userPassword: string;
  },
  signal?: AbortSignal
): Promise<{
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
}> => {
  const response = await fetch(`${WEB_API_URL}user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const json = await response.json();
  if (json.status !== 'OK') {
    throw new Error(json.message || 'Login failed');
  }
  const user = json.data;
  return user;
};

export const register = async (
  payload: {
    userName: string;
    userPhone: string;
    userEmail: string;
    userPassword: string;
  },
  signal?: AbortSignal,
): Promise<any> => {
  const response = await fetch(`${WEB_API_URL}user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to register');
  }

  const json = await response.json();
  if (json.status !== 'OK') {
    throw new Error(json.message || 'Registration failed');
  }

  return json.data;
};
