const router = require("express").Router();

const Clearance = require("../models/Clearance");

router.get("/", async (req, res) => {
  const rows = await Clearance.find({}).lean();
  res.json({ clearances: rows });
});

router.post("/", async (req, res) => {
  const doc = await Clearance.create(req.body);
  res.status(201).json({ clearance: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await Clearance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ clearance: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await Clearance.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;

