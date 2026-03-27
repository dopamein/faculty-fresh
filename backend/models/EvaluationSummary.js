const mongoose = require("mongoose");

const EvaluationSummarySchema = new mongoose.Schema(
  {
    averageRating: { type: Number, required: true, min: 0, max: 5 },
    completedEvaluations: { type: Number, required: true, min: 0 },
    pendingEvaluations: { type: Number, required: true, min: 0 },
    responseRateLabel: { type: String, required: true, trim: true }, // "89%"
    terms: { type: [String], required: true },
    values: { type: [Number], required: true }, // [3.9, 4.1, ...]
  },
  { timestamps: true },
);

EvaluationSummarySchema.index({}, { unique: false });

module.exports = mongoose.model("EvaluationSummary", EvaluationSummarySchema);

