import { Router } from "express";
import { randomUUID } from "node:crypto";
import db from "./db";
import { Task, TaskCreate, TaskUpdate } from "../../shared/task.schema";

const router = Router();

router.get("/tasks", (req, res) => {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY createdAt DESC").all();
  const tasks = rows.map((row: any) =>
    Task.parse({
      id: row.id,
      title: row.title,
      notes: row.notes ?? undefined,
      dueDate: row.dueDate ?? undefined,
      completed: !!row.completed,
      createdAt: row.createdAt,
    })
  );
  res.json(tasks);
});

router.post("/tasks", (req, res) => {
  try {
    const body = TaskCreate.parse(req.body);
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    const params = {
      id,
      title: body.title,
      notes: body.notes ?? undefined,
      dueDate: body.dueDate ?? undefined,
      createdAt,
    };

    db.prepare(
      `
    INSERT INTO tasks (id, title, notes, dueDate, completed, createdAt)
    VALUES (@id, @title, @notes, @dueDate, 0, @createdAt)  
  `
    ).run(params);

    const task = Task.parse({
      id,
      ...body,
      notes: body.notes,
      dueDate: body.dueDate,
      completed: false,
      createdAt,
    });
    res.status(201).json(task);
  } catch (e: any) {
    console.error("POST /tasks failed: ", e);
    res.status(400).json({ error: e?.message ?? "Bad Request" });
  }
});

router.patch("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const patch = TaskUpdate.parse(req.body);
  const sets: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const [key, value] of Object.entries(patch)) {
    sets.push(`${key} = @${key}`);
    params[key] = key === "completed" ? (value ? 1 : 0) : value!;
  }

  const sql = `UPDATE tasks SET ${sets.join(", ")} WHERE id = @id`;
  const info = db.prepare(sql).run(params);

  if (info.changes === 0) return res.status(404).json({ error: "Not found" });

  const row = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id) as Task;
  const updated = Task.parse({
    ...row,
    notes: row.notes ?? "",
    dueDate: row.dueDate ?? undefined,
    completed: !!row.completed,
  });

  res.json(updated);
});

router.delete("/tasks/:id", (req, res) => {
  const id = req.params.id;
  const info = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  if (info.changes === 0) return res.status(404).json({ error: "Not found." });
  res.status(204).end();
});

export default router;
