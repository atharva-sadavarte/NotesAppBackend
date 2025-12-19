/**
 * PURPOSE:
 * --------
 * This script is responsible for creating the application database.
 *
 * WHY THIS EXISTS:
 * ----------------
 * - Database creation should NOT happen during app runtime.
 * - Prevents accidental DB creation/deletion in production.
 * - Used only during initial project setup (local/dev).
 *
 * WHEN TO RUN:
 * ------------
 * Run manually ONE time:
 *   node src/scripts/createDatabase.js
 */

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const createDatabase = async () => {
  // Connect WITHOUT specifying a database
  // (because DB does not exist yet)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
  });

  // Create database safely
  await connection.execute(`
    CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci
  `);

  console.log("✅ Database created or already exists");

  await connection.end();
};

createDatabase().catch((err) => {
  console.error("❌ Failed to create database:", err.message);
});
