/**
 * PURPOSE:
 * --------
 * Inserts initial data for development/testing.
 *
 * WHY THIS EXISTS:
 * ----------------
 * - Allows frontend to test login immediately
 * - Avoids manual DB inserts
 * - NEVER used in production
 *
 * WHAT IT DOES:
 * -------------
 * - Creates a test user with known credentials
 *
 * WHEN TO RUN:
 * ------------
 * node src/scripts/seedData.js
 */

import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const seedData = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const hashedPassword = await bcrypt.hash("123456", 10);

  await connection.execute(
    `
    INSERT IGNORE INTO users (email, password)
    VALUES (?, ?)
    `,
    ["test@mail.com", hashedPassword]
  );

  console.log("✅ Test user seeded (email: test@mail.com, password: 123456)");

  await connection.end();
};

seedData().catch((err) => {
  console.error("❌ Failed to seed data:", err.message);
});
