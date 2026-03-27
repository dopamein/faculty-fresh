const Faculty = require("./models/Faculty");
const SubjectLoad = require("./models/SubjectLoad");
const ScheduleSlot = require("./models/ScheduleSlot");
const AttendanceTrend = require("./models/AttendanceTrend");
const LeaveRequest = require("./models/LeaveRequest");
const SalaryGrade = require("./models/SalaryGrade");
const Allowance = require("./models/Allowance");
const Deduction = require("./models/Deduction");
const TeachingAssignment = require("./models/TeachingAssignment");
const EvaluationSummary = require("./models/EvaluationSummary");
const DashboardSummary = require("./models/DashboardSummary");
const Clearance = require("./models/Clearance");

async function seedDatabase() {
  // Faculty
  if ((await Faculty.estimatedDocumentCount()) === 0) {
    await Faculty.insertMany([
      {
        name: "Prof. Jin Gomez",
        email: "jin@bcp.edu.ph",
        dept: "Computer Science",
        rank: "Professor",
        emp: "Active",
        load: "18 Units",
        att: "Present",
        clear: "Pending",
        init: "MC",
      },
      {
        name: "Prof. Supafly",
        email: "supafly@bcp.edu.ph",
        dept: "Mathematics",
        rank: "Associate Professor",
        emp: "Active",
        load: "21 Units",
        att: "Present",
        clear: "Completed",
        init: "SW",
      },
      {
        name: "Prof. Cardo Mulet",
        email: "cardo@bcp.edu.ph",
        dept: "Engineering",
        rank: "Professor",
        emp: "On Leave",
        load: "0 Units",
        att: "On Leave",
        clear: "Completed",
        init: "JR",
      },
      {
        name: "Prof. Hev Abai",
        email: "hev@bcp.edu.ph",
        dept: "Business",
        rank: "Assistant Professor",
        emp: "Active",
        load: "15 Units",
        att: "Absent",
        clear: "Incomplete",
        init: "ET",
      },
    ]);
  }

  // Subject Loads
  if ((await SubjectLoad.estimatedDocumentCount()) === 0) {
    await SubjectLoad.insertMany([
      {
        id: "FAC-2024-0123",
        name: "Prof. Jin Gomez",
        dept: "Computer Science",
        subjects: "CS401, CS502, CS301",
        units: 18,
        hrs: "18 hrs",
        sections: 3,
        status: "Normal",
        init: "MC",
      },
      {
        id: "FAC-2024-0045",
        name: "Prof. Supafly",
        dept: "Mathematics",
        subjects: "MATH201, MATH301, MATH401",
        units: 24,
        hrs: "24 hrs",
        sections: 4,
        status: "Overload",
        init: "SW",
      },
      {
        id: "FAC-2024-0089",
        name: "Prof. Cardo Mulet",
        dept: "Engineering",
        subjects: "ENG301, ENG401",
        units: 12,
        hrs: "12 hrs",
        sections: 2,
        status: "Normal",
        init: "RM",
      },
    ]);
  }

  // Schedules
  if ((await ScheduleSlot.estimatedDocumentCount()) === 0) {
    const term = "Spring 2024";
    const payload = [
      ["9:00 AM-TUESDAY", "CS401", "Prof. Gomez", "Room 301", "#6366f1"],
      ["9:00 AM-MONDAY", "MATH201", "Prof. Abai", "Room 102", "#8b5cf6"],
      ["9:00 AM-WEDNESDAY", "MATH301", "Prof. Abai", "Room 102", "#8b5cf6"],
      ["11:00 AM-TUESDAY", "BUS101", "Prof. Supafly", "Room 401", "#f59e0b"],
      ["11:00 AM-THURSDAY", "BUS101", "Prof. Supafly", "Room 401", "#f59e0b"],
      ["1:00 PM-MONDAY", "CS502", "Prof. Gomez", "Room 302", "#3b82f6"],
      ["1:00 PM-WEDNESDAY", "CS301", "Prof. Gomez", "Room 301", "#3b82f6"],
      ["3:00 PM-TUESDAY", "ENG401", "Prof. Mulet", "Room 206", "#22c55e"],
      ["3:00 PM-THURSDAY", "ENG401", "Prof. Mulet", "Room 206", "#22c55e"],
    ];
    // UI expects a map like slots["9:00 AM-TUESDAY"] = { code, prof, room, color }.
    const parseKey = (k) => {
      const lastDash = k.lastIndexOf("-");
      const time = k.slice(0, lastDash).trim();
      const day = k.slice(lastDash + 1).trim();
      return { time, day };
    };

    for (const [k, code, prof, room, color] of payload) {
      const { time, day } = parseKey(k);
      await ScheduleSlot.create({
        term,
        time,
        day,
        code,
        prof,
        room,
        color,
      });
    }
  }

  // Attendance trend
  if ((await AttendanceTrend.estimatedDocumentCount()) === 0) {
    await AttendanceTrend.create({
      term: "Spring 2024",
      overallAttendanceLabel: "94.2%",
      lateArrivalsCountLabel: "12",
      absencesCountLabel: "8",
      exceptionsCountLabel: "5",
      points: [96, 95, 97, 94, 96, 93, 95, 94, 96, 95, 94, 96, 95, 94, 95],
      pointsMin: 90,
      pointsMax: 100,
      rollup: [
        { label: "Present", count: 42, color: "#22c55e" },
        { label: "Late", count: 3, color: "#f59e0b" },
        { label: "Absent", count: 2, color: "#ef4444" },
        { label: "On Leave", count: 1, color: "#1d4ed8" },
      ],
    });
  }

  // Leave requests
  if ((await LeaveRequest.estimatedDocumentCount()) === 0) {
    await LeaveRequest.insertMany([
      {
        facultyName: "Prof. Jin Gomez",
        dept: "Computer Science",
        status: "Pending",
        type: "Sick Leave",
        reason: "Medical appointment and recovery time needed...",
        startDate: "March 20, 2024",
        endDate: "March 22, 2024",
        durationLabel: "3 Days",
        submittedAtLabel: "2 hours ago",
        init: "MC",
        tagColor: "yellow",
      },
      {
        facultyName: "Prof. Supafly",
        dept: "Mathematics",
        status: "Approved",
        type: "Vacation",
        reason: "Spring break family vacation...",
        startDate: "March 25, 2024",
        endDate: "March 29, 2024",
        durationLabel: "5 Days",
        submittedAtLabel: "1 day ago",
        init: "SW",
        tagColor: "green",
      },
      {
        facultyName: "Prof. Cardo Mulet",
        dept: "Engineering",
        status: "Under Review",
        type: "Conference",
        reason: "IEEE Engineering Conference attendance...",
        startDate: "April 1, 2024",
        endDate: "April 3, 2024",
        durationLabel: "3 Days",
        submittedAtLabel: "3 hours ago",
        init: "RM",
        tagColor: "blue",
      },
      {
        facultyName: "Prof. Hev Abai",
        dept: "Business",
        status: "Needs Info",
        type: "Personal",
        reason: "Personal family matter...",
        startDate: "March 28, 2024",
        endDate: "March 30, 2024",
        durationLabel: "3 Days",
        submittedAtLabel: "5 hours ago",
        init: "ET",
        tagColor: "red",
      },
    ]);
  }

  // Salary
  if ((await SalaryGrade.estimatedDocumentCount()) === 0) {
    await SalaryGrade.insertMany([
      {
        grade: "SG-24",
        position: "Professor IV",
        steps: "8 Steps",
        base: "₱85,000",
        max: "₱120,000",
        status: "Active",
      },
      {
        grade: "SG-22",
        position: "Associate Professor IV",
        steps: "8 Steps",
        base: "₱65,000",
        max: "₱95,000",
        status: "Active",
      },
      {
        grade: "SG-19",
        position: "Assistant Professor IV",
        steps: "8 Steps",
        base: "₱45,000",
        max: "₱68,000",
        status: "Active",
      },
    ]);
  }

  if ((await Allowance.estimatedDocumentCount()) === 0) {
    await Allowance.insertMany([
      { label: "Teaching Overload", sub: "Per credit hour beyond standard load", val: "₱2,500/hr" },
      { label: "Research Allowance", sub: "Monthly research stipend", val: "₱15,000/mo" },
      { label: "Administrative Load", sub: "Department head/coordinator role", val: "₱25,000/mo" },
    ]);
  }

  if ((await Deduction.estimatedDocumentCount()) === 0) {
    await Deduction.insertMany([
      { label: "SSS Contribution", sub: "Social Security System", val: "4.5%" },
      { label: "PhilHealth", sub: "Health insurance premium", val: "2.75%" },
      { label: "Pag-IBIG", sub: "Home development mutual fund", val: "2%" },
    ]);
  }

  // Teaching history
  if ((await TeachingAssignment.estimatedDocumentCount()) === 0) {
    await TeachingAssignment.insertMany([
      {
        facultyName: "Prof. Jin Gomez",
        dept: "Computer Science",
        term: "Spring 2024",
        subject: "Data Structures",
        code: "CS-201",
        sections: 3,
        units: 9,
        perf: "Excellent",
        rating: 4.8,
        schedule: "MWF 9:00-10:00\nTTH 2:00-3:30",
        init: "SJ",
      },
      {
        facultyName: "Prof. Supafly",
        dept: "Mathematics",
        term: "Fall 2023",
        subject: "Calculus I",
        code: "MATH-101",
        sections: 4,
        units: 12,
        perf: "Very Good",
        rating: 4.5,
        schedule: "MWF 8:00-9:00\nTTH 10:00-11:30",
        init: "MC",
      },
      {
        facultyName: "Prof. Hev Abai",
        dept: "Biology",
        term: "Spring 2024",
        subject: "Molecular Biology",
        code: "BIO-301",
        sections: 2,
        units: 6,
        perf: "Good",
        rating: 4.2,
        schedule: "MW 1:00-2:30\nF 3:00-5:00",
        init: "ER",
      },
      {
        facultyName: "Prof. Cardo Mulet",
        dept: "Engineering",
        term: "Fall 2023",
        subject: "Thermodynamics",
        code: "ENG-205",
        sections: 2,
        units: 6,
        perf: "Excellent",
        rating: 4.9,
        schedule: "TTH 9:00-10:30\nF 1:00-3:00",
        init: "DK",
      },
    ]);
  }

  // Evaluation summary
  if ((await EvaluationSummary.estimatedDocumentCount()) === 0) {
    await EvaluationSummary.create({
      averageRating: 4.3,
      completedEvaluations: 142,
      pendingEvaluations: 18,
      responseRateLabel: "89%",
      terms: ["Fall 22", "Spring 23", "Fall 23", "Spring 24"],
      values: [3.9, 4.1, 4.2, 4.3],
    });
  }

  // Dashboard summary
  if ((await DashboardSummary.estimatedDocumentCount()) === 0) {
    await DashboardSummary.create({
      activities: [
        {
          name: "Prof. Jin Gomez",
          action: "Submitted leave application for March 15-20, 2026",
          time: "2 hours ago",
          tag: "Pending Review",
          dept: "Computer Science",
          tagColor: "yellow",
          init: "MC",
        },
        {
          name: "Prof. Supafly",
          action: "Schedule conflict detected for MATH-301 on Tuesdays",
          time: "4 hours ago",
          tag: "Action Required",
          dept: "Mathematics",
          tagColor: "red",
          init: "SW",
        },
        {
          name: "Prof. Cardo Mulet",
          action: "Completed clearance requirements for Spring 2026",
          time: "6 hours ago",
          tag: "Completed",
          dept: "Engineering",
          tagColor: "green",
          init: "JR",
        },
        {
          name: "Prof. Hev Abai",
          action: "Attendance record updated - 3 absences this month",
          time: "1 day ago",
          tag: "Info",
          dept: "Business",
          tagColor: "blue",
          init: "ET",
        },
      ],
      depts: [
        { name: "Computer Science", count: 48, color: "#0ea5e9", pct: 70 },
        { name: "Engineering", count: 62, color: "#8b5cf6", pct: 90 },
        { name: "Mathematics", count: 35, color: "#22c55e", pct: 50 },
        { name: "Business", count: 52, color: "#f59e0b", pct: 75 },
        { name: "Arts & Sciences", count: 50, color: "#14b8a6", pct: 72 },
      ],
      upcomingTasksText: "Review 18 leave requests",
    });
  }

  // Clearance (minimal seed)
  if ((await Clearance.estimatedDocumentCount()) === 0) {
    await Clearance.insertMany([
      {
        facultyName: "Prof. Jin Gomez",
        status: "Pending",
        requirements: ["Leave clearance", "Document verification"],
      },
      {
        facultyName: "Prof. Supafly",
        status: "Completed",
        requirements: ["Leave clearance"],
      },
    ]);
  }
}

module.exports = { seedDatabase };

