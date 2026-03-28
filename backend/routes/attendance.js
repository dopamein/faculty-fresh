const router = require("express").Router();
const Attendance = require("../models/Attendance");
const AttendanceTrend = require("../models/AttendanceTrend");

router.get("/trend", async (req, res) => {
  const term = (req.query.term || "Spring 2026").trim();
  const allRecords = await Attendance.find({ term }).lean();
  
  if (allRecords.length === 0) {
    // Fallback to legacy document
    const doc = await AttendanceTrend.findOne({ term }).lean();
    if (doc) {
      return res.json({
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
    }
    return res.json({
      term,
      trend: {
        overallAttendanceLabel: "0%", lateArrivalsCountLabel: "0",
        absencesCountLabel: "0", exceptionsCountLabel: "0",
        points: [90, 90, 90], pointsMin: 90, pointsMax: 100,
        rollup: [
          { label: "Present", count: 0, color: "#22c55e" },
          { label: "Late", count: 0, color: "#f59e0b" },
          { label: "Absent", count: 0, color: "#ef4444" },
          { label: "On Leave", count: 0, color: "#4f46e5" },
          { label: "Exception", count: 0, color: "#a855f7" }
        ],
      }
    });
  }

  let present = 0, late = 0, absent = 0, leave = 0, exception = 0;
  for (const r of allRecords) {
    if (r.status === "Present") present++;
    else if (r.status === "Late") late++;
    else if (r.status === "Absent") absent++;
    else if (r.status === "On Leave") leave++;
    else if (r.status === "Exception") exception++;
  }
  
  const total = present + late + absent + leave + exception;
  const overall = total > 0 ? ((present + late) / total * 100).toFixed(1) + "%" : "0%";

  res.json({
    term,
    trend: {
      overallAttendanceLabel: overall,
      lateArrivalsCountLabel: String(late),
      absencesCountLabel: String(absent),
      exceptionsCountLabel: String(exception),
      points: [96, 95, 97, 94, 96, 93, 95, 94, 96, 95, 94, 96, 95, 94, 95], // Static sample for chart
      pointsMin: 90, pointsMax: 100,
      rollup: [
        { label: "Present", count: present, color: "#22c55e" },
        { label: "Late", count: late, color: "#f59e0b" },
        { label: "Absent", count: absent, color: "#ef4444" },
        { label: "On Leave", count: leave, color: "#4f46e5" },
      ],
    }
  });
});

router.get("/", async (req, res) => {
  const rows = await Attendance.find({}).sort({ date: -1 }).lean();
  res.json({ attendance: rows });
});

router.post("/", async (req, res) => {
  const doc = await Attendance.create(req.body);
  res.status(201).json({ attendance: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ attendance: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await Attendance.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;
