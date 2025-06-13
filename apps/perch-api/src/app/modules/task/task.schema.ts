import { z } from 'zod';

const numericIdSchema = z.string().regex(/^\d+$/, 'Must be a valid ID');

const taskBodySchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  completed: z.boolean().optional().default(false),
});

export const createTaskSchema = z.object({
  body: taskBodySchema,
});

export const toggleTaskSchema = z.object({
  params: z.object({
    id: numericIdSchema,
  }),
});

export const deleteTaskSchema = z.object({
  params: z.object({
    id: numericIdSchema,
  }),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type ToggleTaskInput = z.infer<typeof toggleTaskSchema>;
export type DeleteTaskInput = z.infer<typeof deleteTaskSchema>;
