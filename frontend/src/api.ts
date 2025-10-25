import { Task, TaskCreate, TaskUpdate } from "../../shared/task.schema";

const BASE = "http://localhost:5174/api";

export async function listTasks(): Promise<Task[]> {
  const res = await fetch(`${BASE}/tasks`);
  return res.json();
}

export async function createTask(data: TaskCreate): Promise<Task> {
  const res = await fetch(`${BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateTask(id: string, data: TaskUpdate): Promise<Task> {
  const res = await fetch(`${BASE}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteTask(id: string): Promise<void> {
  await fetch(`${BASE}/tasks/${id}`, { method: "DELETE" });
}
