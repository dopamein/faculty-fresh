const router = require("express").Router();

const DashboardSummary = require("../models/DashboardSummary");

router.get("/", async (req, res) => {
  const doc = await DashboardSummary.findOne({}).lean();
  if (!doc) return res.status(404).json({ error: "Dashboard not found" });
  res.json({ summary: doc });
});

module.exports = router;

