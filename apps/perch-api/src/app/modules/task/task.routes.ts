import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import {
  createTask,
  deleteTask,
  getAllTasks,
  toggleTask,
} from './task.controller';

export const taskRoutes = Router();

taskRoutes.get('/', asyncHandler(getAllTasks));
taskRoutes.post('/', asyncHandler(createTask));
taskRoutes.patch('/:id/toggle', asyncHandler(toggleTask));
taskRoutes.delete('/:id', asyncHandler(deleteTask));
