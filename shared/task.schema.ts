import { z } from "zod";

export const Task = z.object({
  id: z.uuid(),
  title: z.string().min(1).max(200),
  notes: z.string().max(2000).optional(),
  dueDate: z
    .string()
    .optional()
    .refine((s) => s === undefined || !isNaN(Date.parse(s)), {
      message: "Invalid ISO date string",
    }),
  completed: z.boolean().default(false),
  createdAt: z
    .string()
    .refine((s) => !isNaN(Date.parse(s)), {
      message: "Invalid ISO date string",
    }),
});

export const TaskCreate = Task.pick({
  title: true,
  notes: true,
  dueDate: true,
});

export const TaskUpdate = Task.partial().refine(
  (data) => Object.keys(data).length > 0,
  "Provide at least one field to update."
);

export type Task = z.infer<typeof Task>;
export type TaskCreate = z.infer<typeof TaskCreate>;
export type TaskUpdate = z.infer<typeof TaskUpdate>;
