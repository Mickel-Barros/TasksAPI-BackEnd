import prisma from '../db/prismaClient';
import { listTasks, createTask, deleteTask, updateTask } from '../services/taskService';

jest.mock('../db/prismaClient', () => ({
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
}));


describe('TaskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTasks', () => {
    it('should list tasks with pagination', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Desc 1', completed: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
      ];
      (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const result = await listTasks(2, 5);

      expect(prisma.task.findMany).toHaveBeenCalledWith({
        where: { deletedAt: null },
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockTasks);
    });
    it('should use default pagination values when no arguments are provided', async () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', description: 'Test', completed: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null },
  ];

  (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

  const result = await listTasks(); 

  expect(prisma.task.findMany).toHaveBeenCalledWith({
    where: { deletedAt: null },
    skip: 0, 
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  expect(result).toEqual(mockTasks);
});

  });

  describe('createTask', () => {
    it('should create a task with title and description', async () => {
      const mockTask = { id: 1, title: 'New Task', description: 'Desc', completed: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await createTask({ title: 'New Task', description: 'Desc' });

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { title: 'New Task', description: 'Desc' },
      });
      expect(result).toEqual(mockTask);
    });

    it('should create a task without description', async () => {
      const mockTask = { id: 1, title: 'New Task', description: null, completed: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
      (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await createTask({ title: 'New Task' });

      expect(prisma.task.create).toHaveBeenCalledWith({
        data: { title: 'New Task', description: null },
      });
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
  it('should soft delete a task', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: 1, deletedAt: null });
    (prisma.task.update as jest.Mock).mockResolvedValue({ id: 1, deletedAt: new Date() });

    await deleteTask(1);

    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('should throw an error if task is not found', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(deleteTask(999)).rejects.toThrow('Task not found');
  });
});

describe('updateTask', () => {
  it('should update task title and description', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: 1, deletedAt: null });
    const mockTask = { id: 1, title: 'Updated Task', description: 'Updated Desc', completed: false, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
    (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

    const result = await updateTask(1, { title: 'Updated Task', description: 'Updated Desc' });

    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { title: 'Updated Task', description: 'Updated Desc', updatedAt: expect.any(Date) },
    });
    expect(result).toEqual(mockTask);
  });

  it('should mark task as completed', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: 1, deletedAt: null });
    const mockTask = { id: 1, title: 'Task', description: 'Desc', completed: true, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
    (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

    const result = await updateTask(1, { completed: true });

    expect(prisma.task.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(prisma.task.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { completed: true, updatedAt: expect.any(Date) },
    });
    expect(result).toEqual(mockTask);
  });

  it('should throw an error if task is not found', async () => {
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(updateTask(999, { title: 'Test' })).rejects.toThrow('Task not found');
  });
});

});
