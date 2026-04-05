import request from 'supertest';
import express from 'express';
import authRoutes from '../routes/auth.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Endpoints', () => {
  test('POST /api/auth/register', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: '123456',
        first_name: 'Test',
        last_name: 'User'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
  });

  test('POST /api/auth/login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: '123456'
      });
    
    expect([200, 401]).toContain(res.statusCode);
  });

  test('POST /api/auth/logout', async () => {
    const res = await request(app)
      .post('/api/auth/logout');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});