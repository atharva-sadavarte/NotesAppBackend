import express from "express";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);

export default app;
