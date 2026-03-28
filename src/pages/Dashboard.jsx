import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

export default function Dashboard() {
  const navigate = useNavigate();
  const quickActions = [
    {
      label: "Add Faculty",
      sub: "Create new profile",
      bg: "#dbeafe",
      path: "/faculty",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#1d4ed8"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
          <line x1="12" y1="3" x2="12" y2="11" stroke="#1d4ed8" />
          <line x1="8" y1="7" x2="16" y2="7" stroke="#1d4ed8" />
        </svg>
      ),
    },
    {
      label: "Assign Schedule",
      sub: "Set class times",
      bg: "#f3e8ff",
      path: "/schedule",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7e22ce"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: "Approve Leave",
      sub: "Review requests",
      bg: "#dcfce7",
      path: "/leave",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
    },
    {
      label: "Export Report",
      sub: "Generate summary",
      bg: "#fff7ed",
      path: "/attendance",
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#c2410c"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      ),
    },
  ];
  const defaultActivities = [
    {
      name: "Prof. Jin Gomez",
      action: "Submitted leave application for March 15-20, 2026",
      time: "2 hours ago",
      tag: "Pending Review",
      dept: "Network Implementation and Support II",
      tagColor: "yellow",
      initials: "MC",
    },
    {
      name: "Prof. Supafly",
      action: "Schedule conflict detected for MATH-301 on Tuesdays",
      time: "4 hours ago",
      tag: "Action Required",
      dept: "Business Process Management in IT",
      tagColor: "red",
      initials: "SW",
    },
    {
      name: "Prof. Cardo Mulet",
      action: "Completed clearance requirements for Spring 2026",
      time: "6 hours ago",
      tag: "Completed",
      dept: "Information Assurance and Security 2",
      tagColor: "green",
      initials: "JR",
    },
    {
      name: "Prof. Hev Abai",
      action: "Attendance record updated - 3 absences this month",
      time: "1 day ago",
      tag: "Info",
      dept: "System Administration and Maintenance",
      tagColor: "blue",
      initials: "ET",
    },
  ];
  const [activities, setActivities] = useState(defaultActivities);

  const defaultDepts = [
    { name: "Network Implementation and Support II", count: 48, color: SIDEBAR_BG, pct: 70 },
    { name: "Information Assurance and Security 2", count: 62, color: ACCENT, pct: 90 },
    { name: "Business Process Management in IT", count: 35, color: "#22c55e", pct: 50 },
    { name: "System Administration and Maintenance", count: 52, color: "#f59e0b", pct: 75 },
    { name: "Arts & Sciences", count: 50, color: "#14b8a6", pct: 72 },
  ];

  const [depts, setDepts] = useState(defaultDepts);

  const [upcomingTasksText, setUpcomingTasksText] = useState(
    "Review 18 leave requests",
  );
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [deptOptions, setDeptOptions] = useState(["All Departments"]);

  useEffect(() => {
    apiFetch("/api/dashboard")
      .then((d) => d?.summary)
      .then((s) => {
        if (!s) return;
        if (Array.isArray(s.activities)) setActivities(s.activities);
        if (Array.isArray(s.depts)) setDepts(s.depts);
        if (typeof s.upcomingTasksText === "string")
          setUpcomingTasksText(s.upcomingTasksText);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      const d = await apiFetch("/api/departments");
      const list = Array.isArray(d?.departments) ? d.departments : [];
      if (list.length) {
        setDeptOptions(["All Departments", ...list]);
        return;
      }
      const fallback = Array.from(
        new Set(
          [...activities.map((a) => a.dept), ...depts.map((d) => d.name)].filter(
            Boolean,
          ),
        ),
      ).sort();
      setDeptOptions(["All Departments", ...fallback]);
    };
    loadDepartments().catch(() => {});
  }, [activities, depts]);

  const visibleActivities =
    deptFilter === "All Departments"
      ? activities
      : activities.filter((a) => a.dept === deptFilter);
  const visibleDepts =
    deptFilter === "All Departments"
      ? depts
      : depts.filter((d) => d.name === deptFilter);
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 20,
        }}
      >
        {quickActions.map((a) => (
          <button
            key={a.label}
            onClick={() => navigate(a.path)}
            style={{
              background: a.bg,
              border: "none",
              borderRadius: 8,
              padding: "18px 16px",
              cursor: "pointer",
              textAlign: "left",
              transition: "transform .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-2px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={{ marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
              {a.label}
            </div>
            <div style={{ color: "#6b7280", fontSize: 12 }}>{a.sub}</div>
          </button>
        ))}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 22,
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <h2
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#111827",
                margin: 0,
              }}
            >
              Recent Activity
            </h2>
            <select
              style={selectStyle}
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {deptOptions.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>
          {visibleActivities.map((a) => (
            <div
              key={a.name}
              style={{
                display: "flex",
                gap: 12,
                paddingBottom: 14,
                borderBottom: "1px solid #f3f4f6",
                marginBottom: 14,
              }}
            >
              <Avatar initials={a.initials} />
              <div style={{ flex: 1 }}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{ fontWeight: 600, color: "#111827", fontSize: 14 }}
                  >
                    {a.name}
                  </span>
                  <span style={{ color: "#9ca3af", fontSize: 12 }}>
                    {a.time}
                  </span>
                </div>
                <div
                  style={{
                    color: "#6b7280",
                    fontSize: 13,
                    margin: "2px 0 6px",
                  }}
                >
                  {a.action}
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  {badge(a.tag, a.tagColor)}
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    {a.dept}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 8,
              padding: 20,
              border: "1px solid #e5e7eb",
            }}
          >
            <h3
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#111827",
                marginBottom: 16,
              }}
            >
              Department Overview
            </h3>
            {visibleDepts.map((d) => (
              <div key={d.name} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span style={{ fontSize: 13, color: "#374151" }}>
                    {d.name}
                  </span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}
                  >
                    {d.count}
                  </span>
                </div>
                <div
                  style={{ background: "#f3f4f6", borderRadius: 99, height: 6 }}
                >
                  <div
                    style={{
                      width: `${d.pct}%`,
                      height: 6,
                      borderRadius: 99,
                      background: d.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: SIDEBAR_BG,
              borderRadius: 8,
              padding: 20,
              color: "#fff",
            }}
          >
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>
              Upcoming Tasks
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 13 }}>{upcomingTasksText}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}