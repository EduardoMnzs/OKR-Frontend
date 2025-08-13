import { env } from 'process';
import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ErrorResponse,
} from '../types/api';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
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

  return response.json();
};

// Função para fazer login
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

  return response.json();
};