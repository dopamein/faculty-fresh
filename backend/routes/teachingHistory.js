const router = require("express").Router();

const TeachingAssignment = require("../models/TeachingAssignment");

router.get("/", async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.max(1, Number(req.query.limit || 10));
  const skip = (page - 1) * limit;

  const [rows, total] = await Promise.all([
    TeachingAssignment.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    TeachingAssignment.countDocuments({}),
  ]);

  res.json({ rows, page, limit, total });
});

router.post("/", async (req, res) => {
  const doc = await TeachingAssignment.create(req.body);
  res.status(201).json({ row: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await TeachingAssignment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ row: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await TeachingAssignment.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

router.patch("/:id/rating", async (req, res) => {
  const rating = Number(req.body?.rating);
  const doc = await TeachingAssignment.findByIdAndUpdate(
    req.params.id,
    { rating },
    { new: true },
  );
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ row: doc });
});

module.exports = router;

