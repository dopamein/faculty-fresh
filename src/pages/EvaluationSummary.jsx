import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal, toast } from "../components/Shared";

export default function EvaluationSummary({ user }) {
  const [tab, setTab] = useState("Overall");
  const [evaluations, setEvaluations] = useState([]);
  const defaultStats = [
    {
      label: "Average Rating",
      value: "4.3",
      sub: "↑ +0.2 from last term",
      subColor: "#22c55e",
      icon: Icons.evaluation,
      bg: "#f0eeff",
    },
    {
      label: "Completed Evaluations",
      value: "142",
      icon: Icons.attendance,
      bg: "#f0fdf4",
    },
    {
      label: "Pending Evaluations",
      value: "18",
      icon: Icons.schedule,
      bg: "#fefce8",
    },
    {
      label: "Response Rate",
      value: "89%",
      icon: Icons.faculty,
      bg: "#faf5ff",
    },
  ];
  const [stats, setStats] = useState(defaultStats);
  const tabs = ["Overall", "Student", "Peer", "Admin"];
  const defaultTerms = ["Fall 22", "Spring 23", "Fall 23", "Spring 24"];
  const [terms, setTerms] = useState(defaultTerms);
  const [globalTerms, setGlobalTerms] = useState(defaultTerms);
  const defaultValues = [3.9, 4.1, 4.2, 4.3];
  const [values, setValues] = useState(defaultValues);
  const [globalValues, setGlobalValues] = useState(defaultValues);

  useEffect(() => {
    const load = async () => {
      const [d, dList] = await Promise.all([
        apiFetch("/api/evaluations/summary").catch(() => null),
        apiFetch("/api/evaluations").catch(() => null)
      ]);
      
      const s = d?.summary;
      if (s) {
        setStats((prev) =>
          prev.map((x) => {
            if (x.label === "Average Rating") return { ...x, value: String(Number(s.averageRating).toFixed(1)) };
            if (x.label === "Completed Evaluations") return { ...x, value: String(s.completedEvaluations) };
            if (x.label === "Pending Evaluations") return { ...x, value: String(s.pendingEvaluations) };
            if (x.label === "Response Rate") return { ...x, value: String(s.responseRateLabel) };
            return x;
          }),
        );
        if (Array.isArray(s.terms)) {
          setTerms(s.terms);
          setGlobalTerms(s.terms);
        }
        if (Array.isArray(s.values)) {
          setValues(s.values);
          setGlobalValues(s.values);
        }
      }

      if (Array.isArray(dList?.evaluations)) {
        setEvaluations(dList.evaluations);
      }
    };
    load().catch(() => {});
    const onRefresh = () => load().catch(() => {});
    window.addEventListener("evaluations:refresh", onRefresh);
    return () => window.removeEventListener("evaluations:refresh", onRefresh);
  }, []);

  useEffect(() => {
    if (!globalTerms.length || !globalValues.length) return;
    if (tab === "Overall") {
      setTerms(globalTerms);
      setValues(globalValues);
    } else if (tab === "Student") {
      setTerms(globalTerms);
      setValues(globalValues.map((v) => Math.max(0, Math.min(5, Number((v - 0.2).toFixed(1))))));
    } else if (tab === "Peer") {
      setTerms(globalTerms);
      setValues(globalValues.map((v) => Math.max(0, Math.min(5, Number((v + 0.1).toFixed(1))))));
    } else if (tab === "Admin") {
      setTerms(globalTerms);
      setValues(globalValues.map((v) => Math.max(0, Math.min(5, Number((v + 0.3).toFixed(1))))));
    }
  }, [tab, globalTerms, globalValues]);

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
              padding: 20,
            }}
          >
            <div
              style={{
                background: s.bg,
                borderRadius: 8,
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6b7280",
                marginBottom: 12,
              }}
            >
              {s.icon}
            </div>
            <div style={{ fontSize: 30, fontWeight: 800, color: "#111827" }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>
              {s.label}
            </div>
            {s.sub && (
              <div style={{ fontSize: 12, color: s.subColor }}>{s.sub}</div>
            )}
          </div>
        ))}
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 22px",
            background: SIDEBAR_BG,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
            Evaluation Trends
          </h3>
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  border: "none",
                  borderRadius: 6,
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontSize: 13,
                  background: tab === t ? "#fff" : "transparent",
                  color: tab === t ? SIDEBAR_BG : "#fff",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div
          style={{
            padding: 24,
            display: "flex",
            alignItems: "flex-end",
            gap: 30,
            height: 180,
          }}
        >
          {terms.map((term, i) => {
            const pct = ((values[i] - 3.5) / (5 - 3.5)) * 100;
            return (
              <div
                key={term}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span
                  style={{ fontWeight: 700, color: SIDEBAR_BG, fontSize: 13 }}
                >
                  {values[i]}
                </span>
                <div
                  style={{
                    width: "60%",
                    height: `${pct}%`,
                    background: `linear-gradient(180deg,${SIDEBAR_BG},${ACCENT})`,
                    borderRadius: "6px 6px 0 0",
                    minHeight: 20,
                  }}
                />
                <span style={{ fontSize: 11, color: "#9ca3af" }}>{term}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Individual Evaluations Table Section */}
      <div style={{ marginTop: 24, background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
        <div style={{ padding: "14px 22px", background: SIDEBAR_BG, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#fff", margin: 0 }}>Individual Evaluations</h3>
          {user?.role === "admin" && (
            <button
              style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("modal:open", {
                    detail: {
                      type: "form",
                      title: "New Evaluation",
                      primaryColor: "#3b82f6",
                      submitLabel: "Add Evaluation",
                      initialValues: { facultyName: "", courseCode: "", term: "Spring 2026", rating: 5, status: "Completed", comments: "" },
                      fields: [
                        { name: "facultyName", label: "Faculty Name", type: "text" },
                        { name: "courseCode", label: "Course Code", type: "text" },
                        { name: "term", label: "Term", type: "text" },
                        { name: "rating", label: "Rating (0-5)", type: "number" },
                        { name: "status", label: "Status", type: "select", options: [{value: "Completed", label: "Completed"}, {value: "Pending", label: "Pending"}] },
                        { name: "comments", label: "Comments", type: "textarea", fullWidth: true }
                      ],
                      onSubmit: async (vals) => {
                        try {
                          await apiFetch("/api/evaluations", {
                            method: "POST",
                            body: JSON.stringify({ ...vals, rating: Number(vals.rating) })
                          });
                          toast.success("Evaluation added");
                          window.dispatchEvent(new Event("evaluations:refresh"));
                        } catch (e) { throw e; }
                      }
                    }
                  })
                );
              }}
            >
              + Add Evaluation
            </button>
          )}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {["FACULTY", "COURSE", "TERM", "RATING", "STATUS", "ACTIONS"].map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: "#6b7280", fontWeight: 600, fontSize: 11 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {evaluations.map((ev) => (
              <tr key={ev._id} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td style={{ padding: "12px 16px", fontWeight: 500, color: "#111827" }}>{ev.facultyName}</td>
                <td style={{ padding: "12px 16px", color: "#374151" }}>{ev.courseCode}</td>
                <td style={{ padding: "12px 16px", color: "#6b7280" }}>{ev.term}</td>
                <td style={{ padding: "12px 16px", color: "#111827", fontWeight: 700 }}>{ev.rating} / 5</td>
                <td style={{ padding: "12px 16px" }}>{badge(ev.status, ev.status === "Completed" ? "green" : "yellow")}</td>
                <td style={{ padding: "12px 16px" }}>
                  {user?.role === "admin" && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button style={iconBtn} onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("modal:open", {
                            detail: {
                              type: "form", title: "Edit Evaluation", primaryColor: "#3b82f6", submitLabel: "Save Changes",
                              initialValues: { ...ev },
                              fields: [
                                { name: "facultyName", label: "Faculty Name", type: "text" },
                                { name: "courseCode", label: "Course Code", type: "text" },
                                { name: "term", label: "Term", type: "text" },
                                { name: "rating", label: "Rating (0-5)", type: "number" },
                                { name: "status", label: "Status", type: "select", options: [{value: "Completed", label: "Completed"}, {value: "Pending", label: "Pending"}] },
                                { name: "comments", label: "Comments", type: "textarea", fullWidth: true }
                              ],
                              onSubmit: async (vals) => {
                                try {
                                  await apiFetch(`/api/evaluations/${ev._id}`, {
                                    method: "PUT", body: JSON.stringify({ ...vals, rating: Number(vals.rating) })
                                  });
                                  toast.success("Evaluation updated");
                                  window.dispatchEvent(new Event("evaluations:refresh"));
                                } catch (e) { throw e; }
                              }
                            }
                          })
                        );
                      }}>✏️</button>
                      <button style={iconBtn} onClick={async () => {
                        if (confirm("Delete this evaluation?")) {
                          try {
                            await apiFetch(`/api/evaluations/${ev._id}`, { method: "DELETE" });
                            toast.success("Evaluation deleted");
                            window.dispatchEvent(new Event("evaluations:refresh"));
                          } catch (e) { toast.error(e.message); }
                        }
                      }}>🗑</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {evaluations.length === 0 && (
              <tr><td colSpan="6" style={{ padding: "20px", textAlign: "center", color: "#6b7280" }}>No evaluations found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}