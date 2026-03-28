import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal, toast } from "../components/Shared";

export default function TeachingHistory({ user }) {
  const [page, setPage] = useState(1);
  const defaultRows = [
    {
      name: "Prof. Jin Gomez",
      dept: "Network Implementation and Support II",
      term: "Spring 2026",
      subject: "Data Structures",
      code: "CS-201",
      sections: 3,
      units: 9,
      perf: "Excellent",
      rating: 4.8,
      initials: "SJ",
    },
    {
      name: "Prof. Supafly",
      dept: "Business Process Management in IT",
      term: "Fall 2026",
      subject: "Calculus I",
      code: "MATH-101",
      sections: 4,
      units: 12,
      perf: "Very Good",
      rating: 4.5,
      initials: "MC",
    },
    {
      name: "Prof. Hev Abai",
      dept: "Biology",
      term: "Spring 2026",
      subject: "Molecular Biology",
      code: "BIO-301",
      sections: 2,
      units: 6,
      perf: "Good",
      rating: 4.2,
      initials: "ER",
    },
    {
      name: "Prof. Cardo Mulet",
      dept: "Information Assurance and Security 2",
      term: "Fall 2026",
      subject: "Thermodynamics",
      code: "ENG-205",
      sections: 2,  
      units: 6,
      perf: "Excellent",
      rating: 4.9,
      initials: "DK",
    },
  ];
  const [rows, setRows] = useState(defaultRows);
  const [total, setTotal] = useState(127);
  const limit = 4;
  const [searchText, setSearchText] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [deptOptions, setDeptOptions] = useState(["All Departments"]);

  const load = async (p = page) => {
    const d = await apiFetch(
      `/api/teaching-history?page=${encodeURIComponent(p)}&limit=${limit}`,
    );
    if (Array.isArray(d?.rows)) setRows(d.rows);
    if (typeof d?.total === "number") setTotal(d.total);
  };

  useEffect(() => {
    load().catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    const loadDepartments = async () => {
      const d = await apiFetch("/api/departments");
      const list = Array.isArray(d?.departments) ? d.departments : [];
      if (list.length) {
        setDeptOptions(["All Departments", ...list]);
        return;
      }
      const local = Array.from(
        new Set((rows || []).map((r) => r.dept).filter(Boolean)),
      ).sort();
      setDeptOptions(["All Departments", ...local]);
    };
    loadDepartments().catch(() => {});
  }, [rows]);

  const perfColor = { Excellent: "green", "Very Good": "blue", Good: "teal" };
  const visibleRows = (rows || []).filter((r) => {
    const depMatch = deptFilter === "All Departments" || r.dept === deptFilter;
    const q = searchText.trim().toLowerCase();
    const searchMatch =
      !q ||
      [r.name, r.subject, r.code, r.term, r.dept]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    return depMatch && searchMatch;
  });
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "12px 18px", background: SIDEBAR_BG }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 14, color: "#fff", margin: 0 }}>
            Teaching Assignment History
          </h3>
          <div style={{ display: "flex", gap: 8 }}>
            {user?.role === "admin" && (
              <button
                style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("modal:open", {
                      detail: {
                        type: "form",
                        title: "New Teaching Assignment",
                        primaryColor: "#3b82f6",
                        submitLabel: "Add Assignment",
                        initialValues: { name: "", dept: "", term: "Spring 2026", subject: "", code: "", sections: 1, units: 3, perf: "Good", rating: null, initials: "" },
                        fields: [
                          { name: "name", label: "Faculty Name", type: "text" },
                          { name: "initials", label: "Initials", type: "text" },
                          { name: "dept", label: "Department", type: "text" },
                          { name: "term", label: "Term", type: "text" },
                          { name: "subject", label: "Subject", type: "text" },
                          { name: "code", label: "Course Code", type: "text" },
                          { name: "sections", label: "Sections", type: "number" },
                          { name: "units", label: "Units", type: "number" },
                          { name: "perf", label: "Performance", type: "select", options: [
                            {value: "Excellent", label: "Excellent"},
                            {value: "Very Good", label: "Very Good"},
                            {value: "Good", label: "Good"}
                          ] }
                        ],
                        onSubmit: async (vals) => {
                          try {
                            await apiFetch("/api/teaching-history", {
                              method: "POST",
                              body: JSON.stringify({ ...vals, sections: Number(vals.sections), units: Number(vals.units) })
                            });
                            toast.success("Assignment added");
                            await load();
                          } catch (e) { throw e; }
                        }
                      }
                    })
                  );
                }}
              >
                + Add Assignment
              </button>
            )}
            <input
              placeholder="Search assignments..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{
                ...inputStyle,
                minWidth: 220,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "#fff",
              }}
            />
            <select
              style={{
                ...selectStyle,
                background: "rgba(255,255,255,0.16)",
                border: "1px solid rgba(255,255,255,0.28)",
                color: "#fff",
              }}
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
        </div>
      </div>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {[
              "FACULTY",
              "TERM",
              "SUBJECT",
              "SECTIONS",
              "UNITS",
              "PERFORMANCE",
              "ACTIONS",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 16px",
                  textAlign: "left",
                  color: "#6b7280",
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((r) => (
            <tr
              key={(r._id || r.name) + r.subject}
              style={{ borderTop: "1px solid #f3f4f6" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9fafb")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <td style={{ padding: "12px 16px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Avatar initials={r.initials} />
                  <div>
                    <div style={{ fontWeight: 600, color: "#111827" }}>
                      {r.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>
                      {r.dept}
                    </div>
                  </div>
                </div>
              </td>
              <td style={{ padding: "12px 16px", color: "#374151" }}>
                {r.term}
              </td>
              <td style={{ padding: "12px 16px" }}>
                <div style={{ fontWeight: 500, color: "#111827" }}>
                  {r.subject}
                </div>
                <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.code}</div>
              </td>
              <td style={{ padding: "12px 16px", color: "#374151" }}>
                {r.sections} sections
              </td>
              <td style={{ padding: "12px 16px", color: "#374151" }}>
                {r.units} units
              </td>
              <td style={{ padding: "12px 16px" }}>
                {badge(r.perf, perfColor[r.perf] || "gray")}
                <span style={{ fontSize: 12, color: "#6b7280", marginLeft: 6 }}>
                  {r.rating}/5.0
                </span>
              </td>
              <td style={{ padding: "12px 16px" }}>
                <button
                  style={iconBtn}
                  onClick={() => {
                    alert(r.schedule || "No schedule stored for this row.");
                  }}
                >
                  📄
                </button>
                {user?.role === "admin" && (
                  <>
                    <button
                      style={{ ...iconBtn, marginLeft: 6 }}
                      onClick={async () => {
                        if (!r._id) return;
                        const val = prompt(
                          "Rating (0-5)",
                          r.rating == null ? "" : String(r.rating),
                        );
                        if (val == null) return;
                        const rating = Number(val);
                        if (Number.isNaN(rating)) return;
                        try {
                          await apiFetch(`/api/teaching-history/${r._id}/rating`, {
                            method: "PATCH",
                            body: JSON.stringify({ rating }),
                          });
                          toast.success("Rating updated");
                          await load();
                        } catch (e) { toast.error(e.message); }
                      }}
                    >
                      ⭐
                    </button>
                    <button
                      style={{ ...iconBtn, marginLeft: 6 }}
                      onClick={() => {
                        window.dispatchEvent(
                          new CustomEvent("modal:open", {
                            detail: {
                              type: "form",
                              title: "Edit Assignment",
                              primaryColor: "#3b82f6",
                              submitLabel: "Save Changes",
                              initialValues: { ...r },
                              fields: [
                                { name: "name", label: "Faculty Name", type: "text" },
                                { name: "initials", label: "Initials", type: "text" },
                                { name: "dept", label: "Department", type: "text" },
                                { name: "term", label: "Term", type: "text" },
                                { name: "subject", label: "Subject", type: "text" },
                                { name: "code", label: "Course Code", type: "text" },
                                { name: "sections", label: "Sections", type: "number" },
                                { name: "units", label: "Units", type: "number" },
                                { name: "perf", label: "Performance", type: "select", options: [
                                  {value: "Excellent", label: "Excellent"},
                                  {value: "Very Good", label: "Very Good"},
                                  {value: "Good", label: "Good"}
                                ] }
                              ],
                              onSubmit: async (vals) => {
                                try {
                                  await apiFetch(`/api/teaching-history/${r._id}`, {
                                    method: "PUT",
                                    body: JSON.stringify({ ...vals, sections: Number(vals.sections), units: Number(vals.units) })
                                  });
                                  toast.success("Assignment updated");
                                  await load();
                                } catch (e) { throw e; }
                              }
                            }
                          })
                        );
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      style={{ ...iconBtn, marginLeft: 6 }}
                      onClick={async () => {
                        if (!r._id) return;
                        if (confirm("Delete this teaching assignment?")) {
                          try {
                            await apiFetch(`/api/teaching-history/${r._id}`, { method: "DELETE" });
                            toast.success("Assignment deleted");
                            await load();
                          } catch (e) { toast.error(e.message); }
                        }
                      }}
                    >
                      🗑
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          padding: "14px 22px",
          borderTop: "1px solid #f3f4f6",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          {`Showing ${total ? (page - 1) * limit + 1 : 0}-${
            total ? Math.min(page * limit, total) : 0
          } of ${total} assignments`}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {["‹", 1, 2, 3, "›"].map((p, i) => (
            <button
              key={i}
              onClick={() => typeof p === "number" && setPage(p)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                padding: "4px 10px",
                cursor: "pointer",
                background: page === p ? SIDEBAR_BG : "#fff",
                color: page === p ? "#fff" : "#374151",
                fontSize: 13,
              }}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}