const mongoose = require("mongoose");

const SubjectLoadSchema = new mongoose.Schema(
  {
    // UI uses a string "id" like FAC-2024-0123
    id: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    dept: { type: String, required: true, trim: true, index: true },
    subjects: { type: String, required: true, trim: true },
    units: { type: Number, required: true },
    hrs: { type: String, required: true, trim: true },
    sections: { type: Number, required: true },
    status: { type: String, required: true, trim: true }, // Normal / Overload
    init: { type: String, required: true, trim: true },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

module.exports = mongoose.model("SubjectLoad", SubjectLoadSchema);

