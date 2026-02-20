import express from 'express';
import db from '../db.js';
import { validateJwt } from '../middleware/auth.js';

const router = express.Router();

router.get('/', validateJwt, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT balance FROM customers WHERE customer_id = ?',
      [req.customerId]
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    res.json({ balance: Number(rows[0].balance) });
  } catch (err) {
    console.error('Balance error:', err);
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

export default router;
