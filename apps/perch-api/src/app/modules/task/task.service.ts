import { Task } from '../../../database/models/task.model';
import { NotFoundError } from '../../errors/not-found-error';
import { CreateTaskInput } from './task.schema';

export const getAllTasks = async () => {
  return await Task.findAll({ order: [['id', 'DESC']] });
};

export const createTask = async (taskData: CreateTaskInput['body']) => {
  return await Task.create(taskData);
};

export const toggleTaskCompletion = async (id: string) => {
  const task = await Task.findByPk(id);
  if (!task) {
    throw new NotFoundError('Task not found');
  }
  task.completed = !task.completed;
  await task.save();
  return task;
};

export const deleteTask = async (id: string) => {
  const deletedCount = await Task.destroy({ where: { id } });
  if (deletedCount === 0) {
    throw new NotFoundError('Task not found');
  }
};
