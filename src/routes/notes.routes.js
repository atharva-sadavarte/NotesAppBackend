import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createNote,
  getNotes,
  getNoteById,
  deleteNote,
} from "../controllers/notes.controller.js";

const router = express.Router();

// 🔐 Protect all routes
router.use(authMiddleware);

// GET /notes
router.get("/", getNotes);

// GET /notes/:id
router.get("/:id", getNoteById);

// POST /notes
router.post("/", createNote);

router.delete("/:id", authMiddleware, deleteNote);

export default router;
