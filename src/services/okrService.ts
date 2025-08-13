import { getAuthToken } from "./authService";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/okrs`;
const API_KEY_RESULTS_URL = `${import.meta.env.VITE_API_URL}/key-results`; // URL para Key Results

// A interface KeyResultPayload agora inclui 'current_value'
export interface KeyResultPayload {
  title: string;
  target: number;
  unit: string;
  current_value: number; // <<< Adicionado o campo que faltava
}

export interface OKRPayload {
  title: string;
  description?: string;
  responsible: string;
  due_date: string;
}

export const createOKR = async (okrData: OKRPayload): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(okrData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao criar OKR.");
  }

  return response.json();
};

export const createKeyResult = async (okrId: string, keyResultData: KeyResultPayload): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_BASE_URL}/${okrId}/key-results`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(keyResultData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao criar Key Result.");
  }

  return response.json();
};

export const getOkrs = async (): Promise<any[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(API_BASE_URL, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao buscar OKRs.");
  }

  return response.json();
};

export const deleteOKR = async (id: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao deletar OKR.");
  }
};

export const updateOKR = async (id: string, okrData: OKRPayload): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(okrData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao atualizar OKR.");
  }

  return response.json();
};

export const updateKeyResult = async (id: string, keyResultData: KeyResultPayload): Promise<any> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_KEY_RESULTS_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(keyResultData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao atualizar Key Result.");
  }

  return response.json();
};

export const deleteKeyResult = async (id: string): Promise<void> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_KEY_RESULTS_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao deletar Key Result.");
  }
};