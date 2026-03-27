const mongoose = require("mongoose");

const TeachingAssignmentSchema = new mongoose.Schema(
  {
    facultyName: { type: String, required: true, trim: true, index: true },
    dept: { type: String, required: true, trim: true, index: true },
    term: { type: String, required: true, trim: true, index: true },
    subject: { type: String, required: true, trim: true, index: true },
    code: { type: String, required: true, trim: true },
    sections: { type: Number, required: true },
    units: { type: Number, required: true },
    perf: { type: String, required: true, trim: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    schedule: { type: String, default: "" },
    init: { type: String, default: "" },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

TeachingAssignmentSchema.index(
  { facultyName: 1, term: 1, subject: 1, code: 1 },
  { unique: false },
);

module.exports = mongoose.model("TeachingAssignment", TeachingAssignmentSchema);

