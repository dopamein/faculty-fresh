const mongoose = require("mongoose");

const LeaveRequestSchema = new mongoose.Schema(
  {
    facultyName: { type: String, required: true, trim: true, index: true },
    dept: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      required: true,
      trim: true,
      index: true,
    }, // Pending / Approved / Under Review / Needs Info / Denied
    type: { type: String, required: true, trim: true },
    reason: { type: String, default: "" },
    startDate: { type: String, required: true }, // keep as UI string
    endDate: { type: String, required: true },
    durationLabel: { type: String, default: "" }, // "3 Days"
    submittedAtLabel: { type: String, default: "" }, // "2 hours ago"
    initials: { type: String, required: true, trim: true },
    tagColor: { type: String, default: "" },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

module.exports = mongoose.model("LeaveRequest", LeaveRequestSchema);

