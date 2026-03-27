const mongoose = require("mongoose");

const SalaryGradeSchema = new mongoose.Schema(
  {
    grade: { type: String, required: true, trim: true, index: true, unique: true },
    position: { type: String, required: true, trim: true },
    steps: { type: String, required: true, trim: true },
    base: { type: String, required: true, trim: true },
    max: { type: String, required: true, trim: true },
    status: { type: String, required: true, trim: true, default: "Active" }, // Active / Inactive
  },
  { timestamps: true },
);

module.exports = mongoose.model("SalaryGrade", SalaryGradeSchema);

