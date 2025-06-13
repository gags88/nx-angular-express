import { Request, Response } from 'express';
import * as taskService from './task.service';

export const getAllTasks = async (req: Request, res: Response) => {
  const tasks = await taskService.getAllTasks();
  res.json(tasks);
};

export const createTask = async (req: Request, res: Response) => {
  const task = await taskService.createTask(req.body);
  res.status(201).json(task);
};

export const toggleTask = async (req: Request, res: Response) => {
  const task = await taskService.toggleTaskCompletion(req.params.id);
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  await taskService.deleteTask(req.params.id);
  res.status(204).end();
};
