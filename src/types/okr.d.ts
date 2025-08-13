export interface KeyResult {
  id: string;
  title: string;
  target: number;
  unit: string;
  current_value: number;
  okr_id: string;
}

export interface Comment {
  id: string;
  content: string;
  okr_id: string;
  user_id: string;
}

export interface OKR {
  id: string;
  title: string;
  description: string;
  responsible: string;
  due_date: string;
  status: "on-track" | "at-risk" | "behind" | "completed";
  user_id: string | null;
  createdAt: string;
  updatedAt: string;
  keyResults: KeyResult[];
  comments: Comment[];
}