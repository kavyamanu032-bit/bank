import 'dotenv/config';
import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runSchema() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    const schemaPath = join(__dirname, '..', 'database', 'schema.sql');
    const schema = readFileSync(schemaPath, 'utf8');
    console.log('Running schema...');
    await connection.query(schema);
    console.log('✅ Schema executed successfully!');
    console.log('Tables created: customers, jwt_tokens');
  } catch (error) {
    console.error('❌ Error running schema:', error.message);
    if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error('Note: This error might indicate a connection issue.');
    }
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      console.error('Database connection failed. Check your .env file:');
      console.error('  - DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME');
    }
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runSchema();
