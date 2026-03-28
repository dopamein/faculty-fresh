const router = require("express").Router();
const Evaluation = require("../models/Evaluation");
const EvaluationSummary = require("../models/EvaluationSummary");

router.get("/summary", async (req, res) => {
  const allEvals = await Evaluation.find({}).lean();
  
  if (allEvals.length === 0) {
    // Fallback to legacy single-sumary document if no individual eval rows exist yet
    const legacyDoc = await EvaluationSummary.findOne({}).lean();
    if (legacyDoc) {
      return res.json({ summary: legacyDoc });
    }
    return res.json({
      summary: {
        averageRating: 0,
        completedEvaluations: 0,
        pendingEvaluations: 0,
        responseRateLabel: "0%",
        terms: [],
        values: [],
      }
    });
  }

  let totalRating = 0;
  let completedCount = 0;
  let pendingCount = 0;

  const termGroups = {};

  for (const ev of allEvals) {
    const isCompleted = ev.status === "Completed";
    if (isCompleted) {
      completedCount++;
      totalRating += (ev.rating || 0);
      
      if (!termGroups[ev.term]) {
        termGroups[ev.term] = { total: 0, count: 0 };
      }
      termGroups[ev.term].total += (ev.rating || 0);
      termGroups[ev.term].count += 1;
    } else {
      pendingCount++;
    }
  }

  const averageRating = completedCount > 0 ? (totalRating / completedCount) : 0;
  const totalEvals = completedCount + pendingCount;
  const responseRate = totalEvals > 0 ? (completedCount / totalEvals) * 100 : 0;

  // sort terms
  const termsArr = Object.keys(termGroups).sort();
  const valuesArr = termsArr.map((t) => termGroups[t].total / termGroups[t].count);

  res.json({
    summary: {
      averageRating: averageRating,
      completedEvaluations: completedCount,
      pendingEvaluations: pendingCount,
      responseRateLabel: `${Math.round(responseRate)}%`,
      terms: termsArr,
      values: valuesArr,
    }
  });
});

router.get("/", async (req, res) => {
  const rows = await Evaluation.find({}).sort({ createdAt: -1 }).lean();
  res.json({ evaluations: rows });
});

router.post("/", async (req, res) => {
  const doc = await Evaluation.create(req.body);
  res.status(201).json({ evaluation: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await Evaluation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ evaluation: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await Evaluation.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
