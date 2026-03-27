const mongoose = require("mongoose");

const AttendanceTrendSchema = new mongoose.Schema(
  {
    term: { type: String, default: "Spring 2024", trim: true },
    overallAttendanceLabel: { type: String, required: true }, // "94.2%"
    lateArrivalsCountLabel: { type: String, required: true }, // "12"
    absencesCountLabel: { type: String, required: true }, // "8"
    exceptionsCountLabel: { type: String, required: true }, // "5"
    points: { type: [Number], required: true },
    pointsMin: { type: Number, default: 90 },
    pointsMax: { type: Number, default: 100 },
    rollup: [
      {
        label: { type: String, required: true },
        count: { type: Number, required: true },
        color: { type: String, required: true },
      },
    ],
  },
  { timestamps: true },
);

AttendanceTrendSchema.index({ term: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceTrend", AttendanceTrendSchema);

