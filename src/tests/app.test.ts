import express from 'express';
import request from 'supertest';
import app from '../app';
import { errorHandler } from '../middleware/errorHandler';

describe('App', () => {
  // App separado para testar middleware de erro
  const testApp = express();
  testApp.get('/test-error', (req, res, next) => {
    const err = new Error('Test error') as any;
    err.status = 500;
    next(err);
  });
  testApp.use(errorHandler);

  it('should handle errors with a 500 status and error message', async () => {
    const response = await request(testApp).get('/test-error');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ success: false, message: 'Test error' });
  });

  it('should return status ok for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok', service: 'tasks-api' });
  });

  it('should apply rate limiting after exceeding limit', async () => {
    for (let i = 0; i < 100; i++) {
      await request(app).get('/');
    }
    const response = await request(app).get('/');
    expect(response.status).toBe(429);
    expect(response.body).toEqual({ success: false, message: 'Too many requests, please try again later.' });
  });
});
