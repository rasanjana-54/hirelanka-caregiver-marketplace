import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { pool, query } from '../db.js';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const fullName = process.env.ADMIN_NAME?.trim();
const phoneNumber = process.env.ADMIN_PHONE?.trim() || '';

if (!process.env.DATABASE_URL || !email || !password || !fullName || password.length < 12) {
  console.error('Set DATABASE_URL, ADMIN_EMAIL, ADMIN_NAME, and an ADMIN_PASSWORD of at least 12 characters.');
  process.exitCode = 1;
} else {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const { rows } = await query(
      `INSERT INTO users (email, password_hash, phone_number, full_name, user_type, is_verified)
       VALUES ($1, $2, $3, $4, 'admin', true)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      [email, passwordHash, phoneNumber, fullName]
    );
    if (rows.length) console.log(`Administrator account created: ${email}`);
    else {
      const { rows: [existingUser] } = await query(
        'SELECT user_type FROM users WHERE email = $1',
        [email]
      );
      if (existingUser?.user_type !== 'admin') {
        throw new Error('An account with this email already exists and is not an administrator. Choose another email.');
      }
      console.log(`An administrator account already exists for ${email}; no changes made.`);
    }
  } catch (error) {
    console.error('Could not create administrator:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}