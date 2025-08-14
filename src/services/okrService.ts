import { getAuthData, getAuthToken } from "./authService";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/okrs`;
const API_KEY_RESULTS_URL = `${import.meta.env.VITE_API_URL}/key-results`;

export interface KeyResultPayload {
  title: string;
  target: number;
  unit: string;
  current_value: number;
}

export interface OKRPayload {
  title: string;
  description?: string;
  responsible: string;
  due_date: string;
}

export interface CommentPayload {
  content: string;
}

export interface Comment {
  id: string;
  content: string;
  okr_id: string;
  user_id: string;
  createdAt: string;
  updatedAt: string;
  user: {
    profile: {
      first_name: string;
      last_name: string;
    };
  };
}

export interface Notification {
  id: string;
  user_id: string;
  event_type: string;
  message: string;
  is_read: boolean;
  link_to: string | null;
  createdAt: string;
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

export const getCommentsByOkr = async (okrId: string): Promise<Comment[]> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_BASE_URL}/${okrId}/comments`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao buscar comentários.");
  }

  return response.json();
};

/**
 * Cria um novo comentário.
 */
export const createComment = async (okrId: string, commentData: CommentPayload): Promise<Comment> => {
  const token = getAuthToken();
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${API_BASE_URL}/${okrId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(commentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao criar comentário.");
  }

  return response.json();
};

export const getNotifications = async (): Promise<Notification[]> => {
  const token = getAuthData().token;
  if (!token) throw new Error("Usuário não autenticado.");

  const response = await fetch(`${import.meta.env.VITE_API_URL}/okrs/notifications`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Falha ao buscar notificações.");
  }

  return response.json();
};