import { Task } from '../../../database/models/task.model';
import { Request, Response } from 'express';

export async function getAll(req: Request, res: Response) {
  const tasks = await Task.findAll({ order: [['id', 'DESC']] });
  res.json(tasks);
}

export async function create(req: Request, res: Response) {
  const task = await Task.create(req.body);
  res.status(201).json(task);
}

export async function toggle(req: Request, res: Response) {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
}

export async function remove(req: Request, res: Response) {
  const deleted = await Task.destroy({ where: { id: req.params.id } });
  res.status(deleted ? 204 : 404).end();
}
