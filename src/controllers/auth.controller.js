/**
 * Auth Controller
 *
 * Handles:
 * - Register
 * - Login
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

/**
 * Register a new user
 */
export const register = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword]
    );

    return res.status(201).json({
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(400).json({
      message: "User already exists",
    });
  }
};

/**
 * Login user and return JWT + user data
 */
export const login = async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ Find user
  const [rows] = await pool.execute(
    "SELECT id, email, password FROM users WHERE email = ?",
    [email]
  );

  if (!rows.length) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const user = rows[0];

  // 2️⃣ Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // 3️⃣ Create JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  // 4️⃣ Send token + safe user data
  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
    },
  });
};
