const router = require("express").Router();

const Faculty = require("../models/Faculty");

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  const filter = {};
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { dept: { $regex: q, $options: "i" } },
    ];
  }

  const faculty = await Faculty.find(filter).sort({ name: 1 }).lean();
  res.json({ faculty });
});

router.post("/", async (req, res) => {
  const doc = await Faculty.create(req.body);
  res.status(201).json({ faculty: doc });
});

router.put("/:id", async (req, res) => {
  const doc = await Faculty.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ faculty: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await Faculty.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;

