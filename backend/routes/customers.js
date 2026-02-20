import express from 'express';
import db from '../db.js';
import { validateJwt } from '../middleware/auth.js';

const router = express.Router();

// Get all customers (for dashboard display)
router.get('/', validateJwt, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT customer_id, customer_name, customer_password, balance, email FROM customers ORDER BY customer_id'
    );
    res.json({ customers: rows });
  } catch (err) {
    console.error('Customers error:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

export default router;
