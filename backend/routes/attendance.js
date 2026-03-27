const router = require("express").Router();

const AttendanceTrend = require("../models/AttendanceTrend");

router.get("/trend", async (req, res) => {
  const term = (req.query.term || "Spring 2024").trim();
  const doc = await AttendanceTrend.findOne({ term }).lean();
  if (!doc) {
    return res.status(404).json({ error: "Trend not found" });
  }

  // UI expects:
  // stats: [{label,value,icon,bg}]
  // rollup: [{label,count,color}]
  // points: number[]
  // But icons/bg/colors are UI-specific; we return just the values.
  res.json({
    term,
    trend: {
      overallAttendanceLabel: doc.overallAttendanceLabel,
      lateArrivalsCountLabel: doc.lateArrivalsCountLabel,
      absencesCountLabel: doc.absencesCountLabel,
      exceptionsCountLabel: doc.exceptionsCountLabel,
      points: doc.points,
      pointsMin: doc.pointsMin,
      pointsMax: doc.pointsMax,
      rollup: doc.rollup,
    },
  });
});

module.exports = router;

