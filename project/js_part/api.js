const MOCK_USER = { id: 1, name: 'Иван', email: 'test@lyceum.ru' };
const MOCK_POSTS = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  author: 'Пользователь ' + (i % 3 + 1),
  text: `Текст поста номер ${i + 1}`,
  date: new Date().toLocaleDateString()
}));

export const api = {
  async login(email, pass) {
    await new Promise(r => setTimeout(r, 300));
    if (email && pass.length > 5) return { success: true, user: MOCK_USER };
    throw new Error('Неверный логин/пароль');
  },

  async register(name, email, pass) {
    await new Promise(r => setTimeout(r, 300));
    if (email.includes('@')) return { success: true, user: MOCK_USER };
    throw new Error('Ошибка');
  },

  async getPosts(page = 1, limit = 5) {
    await new Promise(r => setTimeout(r, 300));
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      posts: MOCK_POSTS.slice(start, end),
      total: MOCK_POSTS.length,
      page,
      limit
    };
  }
};