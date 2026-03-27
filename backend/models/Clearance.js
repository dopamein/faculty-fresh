const mongoose = require("mongoose");

const ClearanceSchema = new mongoose.Schema(
  {
    facultyName: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      required: true,
      trim: true,
      default: "Pending",
    },
    requirements: { type: [String], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Clearance", ClearanceSchema);

