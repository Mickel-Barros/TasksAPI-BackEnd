import { errorHandler } from '../middleware/errorHandler';
import { Request, Response, NextFunction } from 'express';

describe('ErrorHandler Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle errors with custom status and message', () => {
    const err = { status: 400, message: 'Bad Request' };

    errorHandler(err, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith('❌ Erro:', err);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Bad Request' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should handle errors with default status and message', () => {
    const err = new Error('Unexpected error');

    errorHandler(err, req as Request, res as Response, next);

    expect(console.error).toHaveBeenCalledWith('❌ Erro:', err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Unexpected error' });
    expect(next).not.toHaveBeenCalled();
  });
  it('should return 404 for "Task not found" error', () => {
    const err = new Error('Task not found');

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Task not found',
    });
  });

  it('should return provided status code for known errors', () => {
    const err = { message: 'Something went wrong', status: 403 };

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Something went wrong',
    });
  });

  it('should default to 500 for unknown errors', () => {
    const err = {};

    errorHandler(err, req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Internal Server Error',
    });
  });
});
