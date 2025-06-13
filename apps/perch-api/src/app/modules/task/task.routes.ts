import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTaskSchema,
  toggleTaskSchema,
  deleteTaskSchema,
} from './task.schema';
import {
  getAllTasks,
  createTask,
  toggleTask,
  deleteTask,
} from './task.controller';
import { validate } from '../../middlewares/validate.middleware';

export const taskRoutes = Router();

taskRoutes.get('/', asyncHandler(getAllTasks));
taskRoutes.post('/', validate(createTaskSchema), asyncHandler(createTask));
taskRoutes.patch(
  '/:id/toggle',
  validate(toggleTaskSchema),
  asyncHandler(toggleTask)
);
taskRoutes.delete('/:id', validate(deleteTaskSchema), asyncHandler(deleteTask));
