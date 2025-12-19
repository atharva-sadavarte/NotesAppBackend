/**
 * PURPOSE:
 * --------
 * Creates all required tables for the application.
 *
 * WHY THIS EXISTS:
 * ----------------
 * - Keeps schema creation OUT of app runtime.
 * - Ensures foreign key order is correct.
 * - Safe to re-run (idempotent).
 *
 * TABLES CREATED:
 * ---------------
 * 1. users
 * 2. notes
 * 3. indexes for performance
 *
 * WHEN TO RUN:
 * ------------
 * After database is created:
 *   node src/scripts/createTables.js
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const createTables = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  /**
   * USERS TABLE
   * - Stores application users
   * - Passwords are stored as bcrypt hashes
   */
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ users table ready");

  /**
   * NOTES TABLE
   * - Uses STRING ID (note_uuid) instead of auto-increment
   * - Each note belongs to a user
   * - Cascade delete keeps DB clean
   */
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id VARCHAR(50) PRIMARY KEY,
      user_id INT UNSIGNED NOT NULL,
      title VARCHAR(200) NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT fk_notes_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
    )
  `);

  console.log("✅ notes table ready");

  /**
   * INDEX
   * - Speeds up queries like:
   *   SELECT * FROM notes WHERE user_id=?
   *
   * NOTE:
   * - MySQL does NOT support CREATE INDEX IF NOT EXISTS reliably
   * - So we safely drop and recreate
   */
  try {
    await connection.execute(`DROP INDEX idx_notes_user_id ON notes`);
  } catch {}

  await connection.execute(`
    CREATE INDEX idx_notes_user_id ON notes(user_id)
  `);

  console.log("✅ index created");

  await connection.end();
};

createTables().catch((err) => {
  console.error("❌ Failed to create tables:", err.message);
});
