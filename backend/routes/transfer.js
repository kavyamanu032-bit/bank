import express from 'express';
import db from '../db.js';
import { validateJwt } from '../middleware/auth.js';

const router = express.Router();

router.post('/', validateJwt, async (req, res) => {
  const { recipient_email, amount } = req.body;
  const amountNum = parseFloat(amount);

  if (!recipient_email?.trim()) {
    return res.status(400).json({ error: 'Recipient email is required' });
  }
  if (typeof amountNum !== 'number' || amountNum <= 0 || !Number.isFinite(amountNum)) {
    return res.status(400).json({ error: 'Valid positive amount is required' });
  }

  const recipientEmail = recipient_email.trim().toLowerCase();

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [senders] = await connection.query(
      'SELECT customer_id, balance, email FROM customers WHERE customer_id = ? FOR UPDATE',
      [req.customerId]
    );
    if (!senders || senders.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Sender not found' });
    }
    const sender = senders[0];
    if ((sender.email || '').toLowerCase() === recipientEmail) {
      await connection.rollback();
      return res.status(400).json({ error: 'Cannot transfer to yourself' });
    }
    const senderBalance = Number(sender.balance);
    if (senderBalance < amountNum) {
      await connection.rollback();
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    let [recipients] = await connection.query(
      'SELECT customer_id, balance FROM customers WHERE email = ? FOR UPDATE',
      [recipientEmail]
    );
    
    // Track if we need to create a new customer
    let recipientCreated = false;
    
    // If recipient doesn't exist, create a new customer account
    if (!recipients || recipients.length === 0) {
      recipientCreated = true;
      // Extract name from email (part before @) as default name
      const defaultName = recipientEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      // Create new customer with balance 0, then add transfer amount
      await connection.query(
        'INSERT INTO customers (customer_name, email, customer_password, balance) VALUES (?, ?, ?, 0)',
        [defaultName, recipientEmail, '']
      );
      
      // Fetch the newly created recipient
      [recipients] = await connection.query(
        'SELECT customer_id, balance FROM customers WHERE email = ? FOR UPDATE',
        [recipientEmail]
      );
    }

    await connection.query(
      'UPDATE customers SET balance = balance - ? WHERE customer_id = ?',
      [amountNum, req.customerId]
    );
    await connection.query(
      'UPDATE customers SET balance = balance + ? WHERE email = ?',
      [amountNum, recipientEmail]
    );

    await connection.commit();
    res.json({ 
      message: recipientCreated 
        ? 'Transfer successful. New recipient account created.' 
        : 'Transfer successful',
      recipientCreated
    });
  } catch (err) {
    await connection.rollback();
    console.error('Transfer error:', err);
    res.status(500).json({ error: 'Transfer failed' });
  } finally {
    connection.release();
  }
});

export default router;
