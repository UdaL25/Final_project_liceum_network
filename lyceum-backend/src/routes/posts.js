import express from 'express';
import { query } from '../db.js';

const router = express.Router();
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    
    const postsResult = await query(
      `SELECT p.*, u.first_name || ' ' || u.last_name AS author_name 
       FROM posts p 
       JOIN users u ON p.author_id = u.id 
       ORDER BY p.published_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );    
    const countResult = await query(`SELECT COUNT(*) FROM posts`);    
    res.json({
      posts: postsResult.rows,
      total: parseInt(countResult.rows[0].count),
      page,
      limit
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { group_id, author_id, title, content } = req.body;
    
    const result = await query(
      `INSERT INTO posts (group_id, author_id, title, content) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [group_id, author_id, title, content]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM posts WHERE id = $1`,
      [req.params.id]
    );    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Пост не найден' });
    }    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, content } = req.body;    
    const result = await query(
      `UPDATE posts SET title = COALESCE($1, title), content = COALESCE($2, content)
       WHERE id = $3 RETURNING *`,
      [title, content, req.params.id]
    );    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await query(`DELETE FROM posts WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Пост удалён' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
export default router;