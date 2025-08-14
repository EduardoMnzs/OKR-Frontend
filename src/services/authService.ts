import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ErrorResponse,
} from '../types/api';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export interface AuthData {
  token: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export const setAuthData = (data: AuthData) => {
  localStorage.setItem('authData', JSON.stringify(data));
};

export const getAuthData = (): AuthData => {
  const data = localStorage.getItem('authData');
  if (data) {
    return JSON.parse(data);
  }
  return { token: null, firstName: null, lastName: null, email: null };
};

export const getAuthToken = (): string | null => {
  return getAuthData().token;
};

export const getUserFirstName = (): string | null => {
  return getAuthData().firstName;
};

export const removeAuthData = () => {
  localStorage.removeItem('authData');
};

export const register = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error || 'Falha no registro.');
  }

  const data: AuthResponse = await response.json();
  
  setAuthData({
    token: data.token,
    firstName: data.user.profile?.first_name || null,
    lastName: data.user.profile?.last_name || null,
    email: data.user.email || null,
  });

  return data;
};

export const login = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error || 'Falha no login.');
  }

  const data: AuthResponse = await response.json();
  
  setAuthData({
    token: data.token,
    firstName: data.user.profile?.first_name || null,
    lastName: data.user.profile?.last_name || null,
    email: data.user.email || null,
  });

  return data;
};