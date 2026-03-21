import { api } from './api.js';

describe('API Mocks', () => {
  test('Login success', async () => {
    const res = await api.login('test@test.com', '123456');
    expect(res.success).toBe(true);
  });

  test('Login fail', async () => {
    await expect(api.login('test@test.com', '123')).rejects.toThrow('Неверный');
  });

  test('Get Posts pagination', async () => {
    const res = await api.getPosts(1, 5);
    expect(res.posts.length).toBeLessThanOrEqual(5);
    expect(res.page).toBe(1);
  });
});