import jwt from 'jsonwebtoken';
import db from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function validateJwt(req, res, next) {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded.customer_id) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const [rows] = await db.query(
      'SELECT token_id, customer_id, expiry_time FROM jwt_tokens WHERE token_value = ?',
      [token]
    );
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Token not found or revoked' });
    }

    const stored = rows[0];
    const expiry = new Date(stored.expiry_time);
    if (expiry <= new Date()) {
      await db.query('DELETE FROM jwt_tokens WHERE token_id = ?', [stored.token_id]);
      return res.status(401).json({ error: 'Token expired' });
    }

    req.customerId = decoded.customer_id;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
}
