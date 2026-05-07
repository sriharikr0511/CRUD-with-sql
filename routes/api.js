const express = require('express');
const mysql = require('mysql2/promise');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// configure DB pool (adjust credentials if needed)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'delta_app',
  waitForConnections: true,
  connectionLimit: 10,
});

// GET /api/users - list users (no passwords)
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email FROM user');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, username, email FROM user WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users - create user
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  const id = uuidv4();
  try {
    await pool.query('INSERT INTO user (id, username, email, password) VALUES (?, ?, ?, ?)', [id, username, email, password]);
    res.status(201).json({ id, username, email });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/users/:id - update username/email (requires current password check if provided)
router.patch('/users/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    const user = rows[0];

    // if password provided, validate before updates
    if (req.body.currentPassword && req.body.currentPassword !== user.password) {
      return res.status(403).json({ error: 'Invalid password' });
    }

    const updates = [];
    const vals = [];
    if (req.body.username) { updates.push('username = ?'); vals.push(req.body.username); }
    if (req.body.email) { updates.push('email = ?'); vals.push(req.body.email); }
    if (updates.length === 0) return res.status(400).json({ error: 'No updatable fields provided' });
    vals.push(id);

    await pool.query(`UPDATE user SET ${updates.join(', ')} WHERE id = ?`, vals);
    res.json({ id });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email already exists' });
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM user WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
