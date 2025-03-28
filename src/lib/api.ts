import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

export const getTodos = async (): Promise<Todo[]> => {
  const response = await api.get("/todos");
  return response.data;
};

export const getTodo = async (id: number): Promise<Todo> => {
  const response = await api.get(`/todos/${id}`);
  return response.data;
};

export const createTodo = async (
  title: string,
  description: string
): Promise<Todo> => {
  const response = await api.post("/todos", { title, description });
  return response.data;
};

export const updateTodo = async (
  id: number,
  data: Partial<Todo>
): Promise<Todo> => {
  const response = await api.put(`/todos/${id}`, data);
  return response.data;
};

export const deleteTodo = async (id: number): Promise<Todo> => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};

export default api;
