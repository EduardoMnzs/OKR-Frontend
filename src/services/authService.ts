import {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  ErrorResponse,
} from '../types/api';

const API_BASE_URL = `${import.meta.env.VITE_API_URL}`;

// Nova função para salvar token e nome do usuário
export const setAuthData = (token: string, firstName: string) => {
  localStorage.setItem('authToken', token);
  localStorage.setItem('userFirstName', firstName);
};

// Nova função para buscar o primeiro nome do usuário
export const getUserFirstName = (): string | null => {
  return localStorage.getItem('userFirstName');
};

// Funções para gerenciar o token
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const removeAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userFirstName');
};

// Função para registrar
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
  
  // Salva o token e o primeiro nome após o registro
  if (data.user.profile?.first_name) {
    setAuthData(data.token, data.user.profile.first_name);
  }

  return data;
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

  const data: AuthResponse = await response.json();
  
  // Salva o token e o primeiro nome após o login
  if (data.user.profile?.first_name) {
    setAuthData(data.token, data.user.profile.first_name);
  }

  return data;
};