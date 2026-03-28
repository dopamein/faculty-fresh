const mongoose = require("mongoose");

const EvaluationSchema = new mongoose.Schema(
  {
    facultyName: { type: String, required: true, trim: true },
    term: { type: String, required: true, trim: true },
    courseCode: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    status: { type: String, enum: ["Completed", "Pending"], default: "Completed" },
    comments: { type: String, trim: true },
  },
  { timestamps: true },
);

// Index to help with fast querying by term and status
EvaluationSchema.index({ term: 1, status: 1 });

module.exports = mongoose.model("Evaluation", EvaluationSchema);
