const mongoose = require("mongoose");

const DashboardSummarySchema = new mongoose.Schema(
  {
    activities: [
      {
        name: { type: String, required: true, trim: true },
        action: { type: String, required: true, trim: true },
        time: { type: String, required: true, trim: true },
        tag: { type: String, required: true, trim: true },
        dept: { type: String, required: true, trim: true },
        tagColor: { type: String, required: true, trim: true },
        init: { type: String, required: true, trim: true },
      },
    ],
    depts: [
      {
        name: { type: String, required: true, trim: true },
        count: { type: Number, required: true },
        color: { type: String, required: true, trim: true },
        pct: { type: Number, required: true },
      },
    ],
    upcomingTasksText: { type: String, default: "" },
  },
  { timestamps: true, suppressReservedKeysWarning: true },
);

DashboardSummarySchema.index({}, { unique: false });

module.exports = mongoose.model("DashboardSummary", DashboardSummarySchema);

