import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal, toast } from "../components/Shared";

export default function AttendanceMonitoring({ user }) {
  const [attendanceList, setAttendanceList] = useState([]);
  const defaultStats = [
    {
      label: "Overall Attendance",
      value: "94.2%",
      icon: Icons.faculty,
      bg: "#dcfce7",
    },
    { label: "Late Arrivals", value: "12", icon: Icons.history, bg: "#fef9c3" },
    { label: "Absences", value: "8", icon: Icons.clearance, bg: "#fee2e2" },
    { label: "Exceptions", value: "5", icon: Icons.evaluation, bg: "#f3e8ff" },
  ];
  const [stats, setStats] = useState(defaultStats);

  const defaultRollup = [
    { label: "Present", count: 42, color: "#22c55e" },
    { label: "Late", count: 3, color: "#f59e0b" },
    { label: "Absent", count: 2, color: "#ef4444" },
    { label: "On Leave", count: 1, color: SIDEBAR_BG },
  ];
  const [rollup, setRollup] = useState(defaultRollup);

  const defaultPoints = [
    96, 95, 97, 94, 96, 93, 95, 94, 96, 95, 94, 96, 95, 94, 95,
  ];
  const [points, setPoints] = useState(defaultPoints);

  useEffect(() => {
    const load = async () => {
      const [d, dList] = await Promise.all([
        apiFetch("/api/attendance/trend?term=Spring%202026").catch(() => null),
        apiFetch("/api/attendance").catch(() => null)
      ]);
      const t = d?.trend;
      if (t) {
        setStats((prev) =>
          prev.map((s) => {
            if (s.label === "Overall Attendance") return { ...s, value: t.overallAttendanceLabel };
            if (s.label === "Late Arrivals") return { ...s, value: t.lateArrivalsCountLabel };
            if (s.label === "Absences") return { ...s, value: t.absencesCountLabel };
            if (s.label === "Exceptions") return { ...s, value: t.exceptionsCountLabel };
            return s;
          }),
        );
        if (Array.isArray(t.rollup)) setRollup(t.rollup);
        if (Array.isArray(t.points)) setPoints(t.points);
      }
      if (Array.isArray(dList?.attendance)) {
        setAttendanceList(dList.attendance);
      }
    };
    load().catch(() => {});
    const onRefresh = () => load().catch(() => {});
    window.addEventListener("attendance:refresh", onRefresh);
    return () => window.removeEventListener("attendance:refresh", onRefresh);
  }, []);
  const W = 500,
    H = 120,
    minV = 90,
    maxV = 100;
  const toY = (v) => H - ((v - minV) / (maxV - minV)) * H;
  const toX = (i) => (i / (points.length - 1)) * W;
  const pathD = points
    .map((v, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(v)}`)
    .join(" ");
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 14,
          marginBottom: 16,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 18,
              display: "flex",
              gap: 14,
              alignItems: "center",
            }}
          >
            <div
              style={{
                background: s.bg,
                borderRadius: 8,
                padding: 10,
                color: "#6b7280",
              }}
            >
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#111827" }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 260px", gap: 16 }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            padding: 20,
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
            Attendance Trend (Last 30 Days)
          </h3>
          <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 120 }}>
            <path
              d={pathD}
              fill="none"
              stroke={SIDEBAR_BG}
              strokeWidth={2.5}
              strokeLinejoin="round"
            />
            {points.map((v, i) => (
              <circle key={i} cx={toX(i)} cy={toY(v)} r={3} fill={SIDEBAR_BG} />
            ))}
          </svg>
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 8,
            border: "1px solid #e5e7eb",
            padding: 20,
          }}
        >
          <h3
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: "#111827",
              marginBottom: 14,
            }}
          >
            Today's Rollup
          </h3>
          {rollup.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px 0",
                borderBottom: "1px solid #f3f4f6",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: r.color,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 13, color: "#374151" }}>
                  {r.label}
                </span>
              </div>
              <span style={{ fontWeight: 700, color: r.color, fontSize: 13 }}>
                {r.count} faculty
              </span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Individual Attendance Table Section */}
      <div style={{ marginTop: 24, background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", background: SIDEBAR_BG, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#fff", margin: 0 }}>Attendance Log</h3>
          {user?.role === "admin" && (
            <button
              style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("modal:open", {
                    detail: {
                      type: "form",
                      title: "New Attendance Record",
                      primaryColor: "#3b82f6",
                      submitLabel: "Save Record",
                      initialValues: { facultyName: "", term: "Spring 2026", status: "Present", notes: "" },
                      fields: [
                        { name: "facultyName", label: "Faculty Name", type: "text" },
                        { name: "term", label: "Term", type: "text" },
                        { name: "status", label: "Status", type: "select", options: [
                          {value: "Present", label: "Present"}, 
                          {value: "Late", label: "Late"},
                          {value: "Absent", label: "Absent"},
                          {value: "On Leave", label: "On Leave"},
                          {value: "Exception", label: "Exception"}
                        ] },
                        { name: "notes", label: "Notes", type: "text", fullWidth: true }
                      ],
                      onSubmit: async (vals) => {
                        try {
                          await apiFetch("/api/attendance", {
                            method: "POST",
                            body: JSON.stringify(vals)
                          });
                          toast.success("Attendance record added");
                          window.dispatchEvent(new Event("attendance:refresh"));
                        } catch(e) { throw e; }
                      }
                    }
                  })
                );
              }}
            >
              + Add Record
            </button>
          )}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["DATE", "FACULTY", "TERM", "STATUS", "NOTES", "ACTIONS"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {attendanceList.map((rec) => {
              let color = "green";
              if (rec.status === "Late") color = "yellow";
              if (rec.status === "Absent") color = "red";
              if (rec.status === "On Leave") color = "blue";
              if (rec.status === "Exception") color = "purple";
              return (
                <tr key={rec._id} style={{ borderTop: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>{new Date(rec.date).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{rec.facultyName}</td>
                  <td style={{ padding: "12px 16px", color: "#374151" }}>{rec.term}</td>
                  <td style={{ padding: "12px 16px" }}>{badge(rec.status, color)}</td>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>{rec.notes || "-"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    {user?.role === "admin" && (
                      <div style={{ display: "flex", gap: 6 }}>
                        <button style={iconBtn} onClick={() => {
                          window.dispatchEvent(
                            new CustomEvent("modal:open", {
                              detail: {
                                type: "form", title: "Edit Record", primaryColor: "#3b82f6", submitLabel: "Save Changes",
                                initialValues: { ...rec },
                                fields: [
                                  { name: "facultyName", label: "Faculty Name", type: "text" },
                                  { name: "term", label: "Term", type: "text" },
                                  { name: "status", label: "Status", type: "select", options: [
                                    {value: "Present", label: "Present"}, 
                                    {value: "Late", label: "Late"},
                                    {value: "Absent", label: "Absent"},
                                    {value: "On Leave", label: "On Leave"},
                                    {value: "Exception", label: "Exception"}
                                  ] },
                                  { name: "notes", label: "Notes", type: "text", fullWidth: true }
                                ],
                                onSubmit: async (vals) => {
                                  try {
                                    await apiFetch(`/api/attendance/${rec._id}`, {
                                      method: "PUT", body: JSON.stringify(vals)
                                    });
                                    toast.success("Record updated");
                                    window.dispatchEvent(new Event("attendance:refresh"));
                                  } catch (e) { throw e; }
                                }
                              }
                            })
                          );
                        }}>✏️</button>
                        <button style={iconBtn} onClick={async () => {
                          if (confirm("Delete this record?")) {
                            try {
                              await apiFetch(`/api/attendance/${rec._id}`, { method: "DELETE" });
                              toast.success("Record deleted");
                              window.dispatchEvent(new Event("attendance:refresh"));
                            } catch(e) { toast.error(e.message); }
                          }
                        }}>🗑</button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            {attendanceList.length === 0 && (
              <tr><td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>No records found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}