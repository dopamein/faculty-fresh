const router = require("express").Router();

const SalaryGrade = require("../models/SalaryGrade");
const Allowance = require("../models/Allowance");
const Deduction = require("../models/Deduction");

// Grades (CRUD)
router.get("/grades", async (req, res) => {
  const grades = await SalaryGrade.find({}).sort({ grade: 1 }).lean();
  res.json({ grades });
});

router.post("/grades", async (req, res) => {
  const doc = await SalaryGrade.create(req.body);
  res.status(201).json({ grade: doc });
});

router.put("/grades/:id", async (req, res) => {
  const doc = await SalaryGrade.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ grade: doc });
});

router.delete("/grades/:id", async (req, res) => {
  const doc = await SalaryGrade.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

// Allowances (CRUD)
router.get("/allowances", async (req, res) => {
  const allowances = await Allowance.find({}).sort({ label: 1 }).lean();
  res.json({ allowances });
});

router.post("/allowances", async (req, res) => {
  const doc = await Allowance.create(req.body);
  res.status(201).json({ allowance: doc });
});

router.put("/allowances/:id", async (req, res) => {
  const doc = await Allowance.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ allowance: doc });
});

router.delete("/allowances/:id", async (req, res) => {
  const doc = await Allowance.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

// Deductions (CRUD)
router.get("/deductions", async (req, res) => {
  const deductions = await Deduction.find({}).sort({ label: 1 }).lean();
  res.json({ deductions });
});

router.post("/deductions", async (req, res) => {
  const doc = await Deduction.create(req.body);
  res.status(201).json({ deduction: doc });
});

router.put("/deductions/:id", async (req, res) => {
  const doc = await Deduction.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ deduction: doc });
});

router.delete("/deductions/:id", async (req, res) => {
  const doc = await Deduction.findByIdAndDelete(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json({ ok: true });
});

module.exports = router;

