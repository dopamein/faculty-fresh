const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const apiRoutes = require("./routes");
const { seedDatabase } = require("./seed");

const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/faculty_fresh";

async function main() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (req, res) => {
    res.json({ ok: true, service: "faculty-fresh-api" });
  });

  app.use("/api", apiRoutes);

  // Basic error handler
  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(err.statusCode || 500).json({
      error: err.message || "Internal server error",
    });
  });

  await mongoose.connect(MONGODB_URI);
  await seedDatabase();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("Failed to start server:", err);
  process.exit(1);
});

