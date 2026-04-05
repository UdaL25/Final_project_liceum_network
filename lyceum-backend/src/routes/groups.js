import express from 'express';
import { query } from '../db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    const result = await query(
      `SELECT * FROM groups ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await query(`SELECT COUNT(*) FROM groups`);
    
    res.json({
      groups: result.rows,
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
    const { name, type, description, created_by } = req.body;
    
    const result = await query(
      `INSERT INTO groups (name, type, description, created_by) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, type, description, created_by]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await query(
      `SELECT * FROM groups WHERE id = $1`,
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Группа не найдена' });
    }
    
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await query(`DELETE FROM groups WHERE id = $1`, [req.params.id]);
    res.json({ message: 'Группа удалена' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;