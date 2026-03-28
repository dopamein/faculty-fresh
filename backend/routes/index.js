const router = require("express").Router();
const { router: authRouter } = require("./auth");

router.use("/auth", authRouter);
router.use("/faculty", require("./faculty"));
router.use("/subject-loads", require("./subjectLoads"));
router.use("/schedules", require("./schedules"));
router.use("/attendance", require("./attendance"));
router.use("/leaves", require("./leaves"));
router.use("/salary", require("./salary"));
router.use("/teaching-history", require("./teachingHistory"));
router.use("/dashboard", require("./dashboard"));
router.use("/evaluations", require("./evaluations"));
router.use("/clearance", require("./clearance"));
router.use("/departments", require("./departments"));

module.exports = router;

