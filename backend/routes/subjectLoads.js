const router = require("express").Router();

const SubjectLoad = require("../models/SubjectLoad");

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { dept: { $regex: q, $options: "i" } },
      { subjects: { $regex: q, $options: "i" } },
      { id: { $regex: q, $options: "i" } },
    ];
  }
  const subjectLoads = await SubjectLoad.find(filter)
    .sort({ name: 1 })
    .lean();
  res.json({ subjectLoads });
});

router.post("/", async (req, res) => {
  const doc = await SubjectLoad.create(req.body);
  res.status(201).json({ subjectLoad: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await SubjectLoad.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ subjectLoad: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await SubjectLoad.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;

