import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import digestRouter from "./routes/digest.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:4173",
      "https://your-vercel-app.vercel.app"
    ],
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json({ limit: "20kb" }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api", digestRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("[Server Error]", err.message);
  res.status(500).json({ error: "Internal server error", detail: err.message });
});

app.listen(PORT, () => {
console.log(`✅ Server running on http://localhost:${PORT}`);  if (!process.env.GROQ_API_KEY) {
    console.warn("⚠️  GROQ_API_KEY is not set — add it to server/.env");
  }
});
