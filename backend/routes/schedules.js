const router = require("express").Router();

const ScheduleSlot = require("../models/ScheduleSlot");

function toKey(time, day) {
  return `${time}-${day}`;
}

router.get("/", async (req, res) => {
  const term = (req.query.term || "Spring 2024").trim();
  const slots = await ScheduleSlot.find({ term }).lean();

  // UI expects a map: slots["9:00 AM-TUESDAY"] = { code, prof, room, color }
  const map = {};
  for (const s of slots) {
    map[toKey(s.time, s.day)] = {
      code: s.code,
      prof: s.prof,
      room: s.room,
      color: s.color,
    };
  }
  res.json({ term, slots: map, slotDocs: slots });
});

router.post("/", async (req, res) => {
  const doc = await ScheduleSlot.create(req.body);
  res.status(201).json({ slot: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await ScheduleSlot.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ slot: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await ScheduleSlot.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

// Simple "publish" action: wipe existing slots for term and recreate from payload.
router.post("/:term/publish", async (req, res) => {
  const term = req.params.term;
  await ScheduleSlot.deleteMany({ term });
  const payload = Array.isArray(req.body?.slots) ? req.body.slots : [];
  const created = [];
  for (const p of payload) {
    const doc = await ScheduleSlot.create({ ...p, term });
    created.push(doc);
  }
  res.json({ ok: true, createdCount: created.length });
});

module.exports = router;

