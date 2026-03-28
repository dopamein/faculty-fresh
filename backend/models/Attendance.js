const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    facultyName: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
    status: { 
      type: String, 
      enum: ["Present", "Late", "Absent", "On Leave", "Exception"], 
      required: true 
    },
    term: { type: String, required: true, trim: true }, // e.g. "Spring 2026"
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

AttendanceSchema.index({ term: 1, date: -1 });

module.exports = mongoose.model("Attendance", AttendanceSchema);
