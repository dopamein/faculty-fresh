const router = require("express").Router();

const Faculty = require("../models/Faculty");
const SubjectLoad = require("../models/SubjectLoad");

router.get("/", async (req, res) => {
  const [facultyRows, subjectRows] = await Promise.all([
    Faculty.find({}, { dept: 1 }).lean(),
    SubjectLoad.find({}, { dept: 1 }).lean(),
  ]);

  const all = [
    ...facultyRows.map((r) => r.dept),
    ...subjectRows.map((r) => r.dept),
  ]
    .filter(Boolean)
    .map((d) => String(d).trim())
    .filter(Boolean);

  const departments = Array.from(new Set(all)).sort((a, b) =>
    a.localeCompare(b),
  );

  res.json({ departments });
});

module.exports = router;

