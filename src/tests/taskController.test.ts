import request from 'supertest';
import app from '../app';
import prisma from '../db/prismaClient';

jest.mock('../db/prismaClient', () => ({
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe('TaskController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should list tasks with pagination', async () => {
      const mockTasks = [
        {
          title: 'Task 1',
          description: 'Desc 1',
        },
      ];
      (prisma.task.findMany as jest.Mock).mockResolvedValue(mockTasks);

      const response = await request(app).get('/tasks?page=1&limit=10').set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
    });

    it('should handle errors when listing tasks', async () => {
      (prisma.task.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/tasks').set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Database error' });
    });
  });

  describe('POST /tasks', () => {
  it('should create a task', async () => {
    const mockTask = { id: 1, title: 'New Task', description: 'Description', completed: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null };
    (prisma.task.create as jest.Mock).mockResolvedValue(mockTask);

    const response = await request(app)
      .post('/tasks')
      .send({ title: 'New Task', description: 'Description' })
      .set('Origin', 'http://localhost:5173');

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockTask);
  });
  it('should return 400 if title is missing or empty', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: '', description: 'Some desc' })
      .set('Origin', 'http://localhost:5173');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
    success: false,
    message: 'Validation failed',
    errors: [
      'title: Title is required',
    ]
  });
  });
  it('should handle unexpected error in createTask', async () => {
  (prisma.task.create as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

  const response = await request(app)
    .post('/tasks')
    .send({ title: 'Error Task', description: 'Something' })
    .set('Origin', 'http://localhost:5173');

  expect(response.status).toBe(500);
  expect(response.body).toEqual({ success: false, message: 'Unexpected error' });
  });

  it('should handle errors when creating a task (validation error)', async () => {
  (prisma.task.create as jest.Mock).mockRejectedValue({
    message: 'Validation failed',
    errors: [
      'title: Title is required',
      'description: Description must be at least 5 characters'
    ]
  });

  const response = await request(app)
    .post('/tasks')
    .send({ title: '', description: 'Desc' })
    .set('Origin', 'http://localhost:5173');

  expect(response.status).toBe(400);
  expect(response.body).toEqual({
    success: false,
    message: 'Validation failed',
    errors: [
      'title: Title is required',
      'description: Description must be at least 5 characters'
    ]
  });
});

});
  describe('DELETE /tasks/:id', () => {
  it('should delete a task', async () => {
    const mockTask = {
      id: 1,
      title: 'Some Task',
      description: 'Desc',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
    };
    (prisma.task.findUnique as jest.Mock).mockResolvedValue(mockTask);
    (prisma.task.update as jest.Mock).mockResolvedValue({
      ...mockTask,
      deletedAt: new Date().toISOString(),
    });

    const response = await request(app)
      .delete('/tasks/1')
      .set('Origin', 'http://localhost:5173');

    expect(response.status).toBe(204);
    expect(response.body).toEqual({});
  });

    it('should handle errors when deleting a task - task not found', async () => {
      (prisma.task.update as jest.Mock).mockRejectedValue({ code: 'P2025' }); 

      const response = await request(app).delete('/tasks/999').set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Task not found' });
    });

    it('should handle other errors when deleting a task', async () => {
      (prisma.task.update as jest.Mock).mockRejectedValue(new Error('Task not found'));

      const response = await request(app).delete('/tasks/1').set('Origin', 'http://localhost:5173');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'Task not found' });
    });
  });

describe('PATCH /tasks/:id', () => {
  it('should update a task', async () => {
    const mockTask = {
      id: 1,
      title: 'Updated Task',
      description: 'Updated Desc',
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null
    };

    (prisma.task.findUnique as jest.Mock).mockResolvedValue({ ...mockTask });    
    (prisma.task.update as jest.Mock).mockResolvedValue(mockTask);

    const response = await request(app)
      .patch('/tasks/1')
      .send({ title: 'Updated Task', description: 'Updated Desc' })
      .set('Origin', 'http://localhost:5173');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTask);
  });

  it('should handle errors when updating a task - task not found', async () => {
    (prisma.task.update as jest.Mock).mockRejectedValue(new Error('Task not found'));

    const response = await request(app)
      .patch('/tasks/999')
      .send({ title: 'Test' })
      .set('Origin', 'http://localhost:5173');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Task not found' });
  });
  it('should return 404 if update returns null (task not found)', async () => {
  (prisma.task.findUnique as jest.Mock).mockResolvedValue(null);

  const response = await request(app)
    .patch('/tasks/999')
    .send({ title: 'Test' })
    .set('Origin', 'http://localhost:5173');

  expect(response.status).toBe(404);
  expect(response.body).toEqual({ success: false, message: 'Task not found' });
});

it('should return 404 on updateTaskController if error is Task not found', async () => {
  const error = new Error('Task not found') as any;
  error.code = 'P2025';
  (prisma.task.findUnique as jest.Mock).mockResolvedValue({ id: 1, deletedAt: null });
  (prisma.task.update as jest.Mock).mockRejectedValue(error);

  const response = await request(app)
    .patch('/tasks/1')
    .send({ title: 'Update' })
    .set('Origin', 'http://localhost:5173');

  expect(response.status).toBe(404);
  expect(response.body).toEqual({ success: false, message: 'Task not found' });
});

  it('should handle other errors when updating a task', async () => {
    (prisma.task.update as jest.Mock).mockRejectedValue(new Error('Task not found'));

    const response = await request(app)
      .patch('/tasks/1')
      .send({ title: 'Test' })
      .set('Origin', 'http://localhost:5173');


    expect(response.status).toBe(404);
    expect(response.body).toEqual({ success: false, message: 'Task not found' });
  });
});

});


