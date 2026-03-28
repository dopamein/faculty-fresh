const mongoose = require("mongoose");

const FacultySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    email: { type: String, required: true, trim: true, index: true },
    dept: { type: String, required: true, trim: true, index: true },
    rank: { type: String, required: true, trim: true },
    emp: { type: String, required: true, trim: true }, // Active / On Leave
    load: { type: String, required: true, trim: true }, // "18 Units"
    att: { type: String, required: true, trim: true }, // Present / Absent / On Leave
    clear: { type: String, required: true, trim: true }, // Pending / Completed / Incomplete
    initials: { type: String, required: true, trim: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

module.exports = mongoose.model("Faculty", FacultySchema);

