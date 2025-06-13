import { Request, Response } from 'express';
import * as taskService from './task.service';
import * as taskController from './task.controller';

jest.mock('./task.service');

describe('Task Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let endMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    endMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock, end: endMock });

    res = {
      json: jsonMock,
      status: statusMock,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [{ id: '1', title: 'Task', completed: false }];
      (taskService.getAllTasks as jest.Mock).mockResolvedValue(mockTasks);

      await taskController.getAllTasks({} as Request, res as Response);

      expect(taskService.getAllTasks).toHaveBeenCalled();
      expect(jsonMock).toHaveBeenCalledWith(mockTasks);
    });
  });

  describe('createTask', () => {
    it('should create a task and return 201', async () => {
      const mockTask = { id: '1', title: 'New Task', completed: false };
      req = { body: { title: 'New Task' } };
      (taskService.createTask as jest.Mock).mockResolvedValue(mockTask);

      await taskController.createTask(req as Request, res as Response);

      expect(taskService.createTask).toHaveBeenCalledWith(req.body);
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('toggleTask', () => {
    it('should toggle a task and return the result', async () => {
      const mockTask = { id: '1', title: 'Task', completed: true };
      req = { params: { id: '1' } };
      (taskService.toggleTaskCompletion as jest.Mock).mockResolvedValue(
        mockTask
      );

      await taskController.toggleTask(req as Request, res as Response);

      expect(taskService.toggleTaskCompletion).toHaveBeenCalledWith('1');
      expect(jsonMock).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return 204', async () => {
      req = { params: { id: '1' } };
      (taskService.deleteTask as jest.Mock).mockResolvedValue(undefined);

      await taskController.deleteTask(req as Request, res as Response);

      expect(taskService.deleteTask).toHaveBeenCalledWith('1');
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(endMock).toHaveBeenCalled();
    });
  });
});
