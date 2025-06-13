import { Request, Response } from 'express';
import * as taskService from './task.service';
import {
  CreateTaskInput,
  DeleteTaskInput,
  ToggleTaskInput,
} from './task.schema';

export const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getAllTasks();
  res.json(tasks);
};

export const createTask = async (
  req: Request<object, object, CreateTaskInput['body']>,
  res: Response
) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
};

export const toggleTask = async (
  req: Request<ToggleTaskInput['params']>,
  res: Response
) => {
  const task = await taskService.toggleTaskCompletion(req.params.id);
  res.json(task);
};

export const deleteTask = async (
  req: Request<DeleteTaskInput['params']>,
  res: Response
) => {
  await taskService.deleteTask(req.params.id);
  res.status(204).end();
};
