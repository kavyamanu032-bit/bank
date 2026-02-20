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
    const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf8');
    console.log('Running schema...');
    await connection.query(schema);
    console.log('✅ Schema executed successfully!');
  } catch (error) {
    console.error('❌ Error running schema:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

runSchema();
