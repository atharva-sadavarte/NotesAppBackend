/**
 * PURPOSE:
 * --------
 * Creates a reusable MySQL connection pool.
 *
 * WHY THIS EXISTS:
 * ----------------
 * - Prevents opening a new DB connection for every request
 * - Improves performance using pooling
 * - Centralizes database configuration
 *
 * USED BY:
 * --------
 * Controllers & services for executing queries
 */

import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
