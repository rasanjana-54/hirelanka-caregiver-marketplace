import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: true } : undefined
});

export const query = (text, values) => pool.query(text, values);

export const migrate = async () => {
  const schemaPath = fileURLToPath(new URL('./database/schema.sql', import.meta.url));
  const seedPath = fileURLToPath(new URL('./database/seed.sql', import.meta.url));
  const schema = await readFile(schemaPath, 'utf8');
  const seed = await readFile(seedPath, 'utf8');
  await pool.query(schema);
  await pool.query(seed);
};

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv[2] === 'migrate') {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is required to run migrations.');
    process.exitCode = 1;
  } else {
    migrate()
      .then(() => console.log('Database schema is up to date.'))
      .catch(error => {
        console.error('Database migration failed:', error.message);
        process.exitCode = 1;
      })
      .finally(() => pool.end());
  }
}