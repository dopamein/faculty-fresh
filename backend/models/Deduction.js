const mongoose = require("mongoose");

const DeductionSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, index: true, unique: true },
    sub: { type: String, required: true, trim: true },
    val: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Deduction", DeductionSchema);

