const router = require("express").Router();

const EvaluationSummary = require("../models/EvaluationSummary");

router.get("/summary", async (req, res) => {
  const doc = await EvaluationSummary.findOne({}).lean();
  if (!doc) return res.status(404).json({ error: "Evaluation summary not found" });
  res.json({ summary: doc });
});

module.exports = router;

