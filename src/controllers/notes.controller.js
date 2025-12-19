import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Get all notes for logged-in user
 */
export const getNotes = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.execute(
    "SELECT id, title, content, created_at FROM notes WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );

  res.json(rows);
};

/**
 * Get single note by ID
 */
export const getNoteById = async (req, res) => {
  const userId = req.user.id;
  const noteId = req.params.id;

  const [rows] = await pool.execute(
    "SELECT id, title, content FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Note not found" });
  }

  res.json(rows[0]);
};

/**
 * Create new note
 */

// Inside createNote
export const createNote = async (req, res) => {
  const { user_id, title, content } = req.body;

  try {
    const id = uuidv4(); // Generate unique id for each note

    await pool.execute(
      "INSERT INTO notes (id, user_id, title, content) VALUES (?, ?, ?, ?)",
      [id, user_id, title, content]
    );

    return res.status(201).json({ message: "Note created", id, title, content });
  } catch (err) {
    console.log("CREATE NOTE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

