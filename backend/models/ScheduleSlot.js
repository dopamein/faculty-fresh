const mongoose = require("mongoose");

const ScheduleSlotSchema = new mongoose.Schema(
  {
    term: { type: String, required: true, trim: true, index: true }, // Spring 2024
    time: { type: String, required: true, trim: true, index: true }, // "9:00 AM"
    day: { type: String, required: true, trim: true, index: true }, // "TUESDAY"
    code: { type: String, required: true, trim: true },
    prof: { type: String, required: true, trim: true },
    room: { type: String, required: true, trim: true },
    color: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

ScheduleSlotSchema.index(
  { term: 1, time: 1, day: 1 },
  { unique: true },
);

module.exports = mongoose.model("ScheduleSlot", ScheduleSlotSchema);

