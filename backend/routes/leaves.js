const router = require("express").Router();

const LeaveRequest = require("../models/LeaveRequest");

router.get("/", async (req, res) => {
  const status = (req.query.status || "").trim();
  const filter = {};
  if (status) filter.status = status;

  const leaves = await LeaveRequest.find(filter).sort({ createdAt: -1 }).lean();
  res.json({ leaves });
});

router.post("/", async (req, res) => {
  const doc = await LeaveRequest.create(req.body);
  res.status(201).json({ leave: doc });
});

router.patch("/:id", async (req, res) => {
  const doc = await LeaveRequest.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ leave: doc });
});

router.delete("/:id", async (req, res) => {
  const doc = await LeaveRequest.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

router.post("/:id/approve", async (req, res) => {
  const doc = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { status: "Approved" },
    { new: true },
  );
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ leave: doc });
});

router.post("/:id/deny", async (req, res) => {
  const doc = await LeaveRequest.findByIdAndUpdate(
    req.params.id,
    { status: "Denied" },
    { new: true },
  );
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ leave: doc });
});

module.exports = router;

