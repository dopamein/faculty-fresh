const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const apiRoutes = require("./routes");
const { seedDatabase } = require("./seed");

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/faculty_fresh";


const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "1mb" }));

// Connect to MongoDB upon request instead of top-level startup (Serverless cold-start cache mechanism)
let isConnected = false;
app.use(async (req, res, next) => {
  if (!isConnected) {
    try {
      await mongoose.connect(MONGODB_URI);
      isConnected = true;
      // Note: We bypass automated seeding in Serverless to prevent 10s timeout limits 
      // await seedDatabase();
    } catch (e) {
      console.error("Vercel DB Connection Error:", e);
    }
  }
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "faculty-fresh-api", dbConnected: isConnected });
});

app.use("/api", apiRoutes);

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    error: err.message || "Internal server error",
  });
});

// Vercel Serverless Export Architecture
module.exports = app;

// Local Development Loop fallback
if (process.env.NODE_ENV !== "production") {
  mongoose.connect(MONGODB_URI).then(async () => {
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  }).catch((err) => {
    console.error("Failed to start server locally:", err);
  });
}

