import 'dotenv/config';
import mysql from 'mysql2/promise';

async function showCustomers() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const [rows] = await connection.query(
      'SELECT customer_id, customer_name, customer_password, balance, email FROM customers ORDER BY customer_id'
    );
    
    if (rows.length === 0) {
      console.log('No customers found in the database.');
      return;
    }

    console.log('\n📊 CUSTOMERS TABLE');
    console.log('═'.repeat(100));
    console.log(
      'ID'.padEnd(8) +
      'Name'.padEnd(25) +
      'Email'.padEnd(30) +
      'Balance'.padEnd(15) +
      'Password Hash'
    );
    console.log('─'.repeat(100));

    rows.forEach((row) => {
      const id = String(row.customer_id).padEnd(8);
      const name = (row.customer_name || '').padEnd(25);
      const email = (row.email || '').padEnd(30);
      const balance = `$${Number(row.balance).toFixed(2)}`.padEnd(15);
      const password = row.customer_password || '';
      const passwordPreview = password.length > 20 ? password.substring(0, 20) + '...' : password;
      
      console.log(id + name + email + balance + passwordPreview);
    });

    console.log('─'.repeat(100));
    console.log(`Total customers: ${rows.length}\n`);
  } catch (error) {
    console.error('❌ Error fetching customers:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('Tables not found. Run: node run-schema.js');
    }
  } finally {
    await connection.end();
  }
}

showCustomers();
