import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRY = '1h';

router.post('/register', async (req, res) => {
  try {
    const { customer_name, email, password } = req.body;
    if (!customer_name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ error: 'customer_name, email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO customers (customer_name, email, customer_password, balance) VALUES (?, ?, ?, 1000)',
      [customer_name.trim(), email.trim().toLowerCase(), hashedPassword]
    );
    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    if (err.code === 'ER_NO_SUCH_TABLE') {
      console.error('Database table missing:', err.message);
      return res.status(500).json({ error: 'Database tables not found. Please run the schema.sql file first.' });
    }
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
      console.error('Database connection failed:', err.message);
      return res.status(500).json({ error: 'Database connection failed. Check your .env file and database credentials.' });
    }
    console.error('Register error:', err);
    res.status(500).json({ 
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await db.query(
      'SELECT customer_id, customer_name, customer_password FROM customers WHERE email = ?',
      [email.trim().toLowerCase()]
    );
    if (!rows || rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const customer = rows[0];
    const valid = await bcrypt.compare(password, customer.customer_password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { customer_id: customer.customer_id },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await db.query(
      'INSERT INTO jwt_tokens (token_value, customer_id, expiry_time) VALUES (?, ?, ?)',
      [token, customer.customer_id, expiryTime]
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000,
      path: '/',
    });
    res.json({
      message: 'Login successful',
      customer_name: customer.customer_name,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      await db.query('DELETE FROM jwt_tokens WHERE token_value = ?', [token]);
    } catch (_) {}
  }
  res.clearCookie('token', { path: '/', httpOnly: true });
  res.json({ message: 'Logged out' });
});

export default router;
