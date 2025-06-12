import { Router } from 'express';
import * as taskService from './task.service';

export const taskRoutes = Router();

taskRoutes.get('/', taskService.getAll);
taskRoutes.post('/', taskService.create);
taskRoutes.patch('/:id/toggle', taskService.toggle);
taskRoutes.delete('/:id', taskService.remove);
