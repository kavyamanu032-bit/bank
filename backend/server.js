import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import balanceRoutes from './routes/balance.js';
import transferRoutes from './routes/transfer.js';
import customersRoutes from './routes/customers.js';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: frontendOrigin, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/balance', balanceRoutes);
app.use('/api/transfer', transferRoutes);
app.use('/api/customers', customersRoutes);

app.get('/api/me', async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await db.query(
      'SELECT customer_name, email FROM customers WHERE customer_id = ?',
      [decoded.customer_id]
    );
    if (!rows?.length) return res.status(401).json({ error: 'Invalid token' });
    const [tokenRows] = await db.query(
      'SELECT 1 FROM jwt_tokens WHERE token_value = ? AND expiry_time > NOW()',
      [token]
    );
    if (!tokenRows?.length) return res.status(401).json({ error: 'Token expired' });
    res.json({ customer_name: rows[0].customer_name, email: rows[0].email });
  } catch (_) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Test database connection on startup
async function testDbConnection() {
  try {
    await db.query('SELECT 1');
    console.log('✅ Database connection successful');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
    console.error('Please check your .env file and ensure:');
    console.error('  - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME are set correctly');
    console.error('  - Database tables are created (run database/schema.sql)');
  }
}

testDbConnection();

app.listen(PORT, () => {
  console.log(`KodBank API running on http://localhost:${PORT}`);
});
