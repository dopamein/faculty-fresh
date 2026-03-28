import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal, toast } from "../components/Shared";

export default function SubjectLoadTracker({ user }) {
  const stats = [
    {
      label: "Total Faculty",
      value: 47,
      tag: "Active",
      tagColor: "green",
      icon: Icons.faculty,
    },
    {
      label: "Total Subjects",
      value: 156,
      tag: "Assigned",
      tagColor: "blue",
      icon: Icons.subjects,
    },
    {
      label: "Overload Cases",
      value: 8,
      tag: "Alert",
      tagColor: "yellow",
      icon: Icons.attendance,
    },
    {
      label: "Avg Units/Faculty",
      value: "18.5",
      tag: "Avg",
      tagColor: "gray",
      icon: Icons.evaluation,
    },
  ];
  const defaultSubjectLoads = [
    {
      name: "Prof. Jin Gomez",
      id: "FAC-2026-0123",
      dept: "Network Implementation and Support II",
      subjects: "CS401, CS502, CS301",
      units: 18,
      hrs: "18 hrs",
      sections: 3,
      status: "Normal",
      initials: "MC",
    },
    {
      name: "Prof. Supafly",
      id: "FAC-2026-0045",
      dept: "Business Process Management in IT",
      subjects: "MATH201, MATH301, MATH401",
      units: 24,
      hrs: "24 hrs",
      sections: 4,
      status: "Overload",
      initials: "SJ",
    },
    {
      name: "Prof. Cardo Mulet",
      id: "FAC-2026-0089",
      dept: "Information Assurance and Security 2",
      subjects: "ENG301, ENG401",
      units: 12,
      hrs: "12 hrs",
      sections: 2,
      status: "Normal",
      initials: "RM",
    },
  ];
  const [faculty, setFaculty] = useState(defaultSubjectLoads);
  const [searchText, setSearchText] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [deptOptions, setDeptOptions] = useState(["All Departments"]);

  const subjectLoadFields = [
    { name: "name", label: "Faculty Name", type: "text" },
    { name: "id", label: "Faculty ID", type: "text" },
    { name: "initials", label: "Initials", type: "text" },
    { name: "dept", label: "Department", type: "text" },
    { name: "subjects", label: "Subjects (comma separated)", type: "text" },
    { name: "units", label: "Units", type: "number" },
    { name: "hrs", label: "Hours/Week (e.g. '12 hrs')", type: "text" },
    { name: "sections", label: "Sections", type: "number" },
    { name: "status", label: "Status", type: "select", options: [
      {value: "Normal", label: "Normal"},
      {value: "Overload", label: "Overload"}
    ] }
  ];

  useEffect(() => {
    const load = async () => {
      const d = await apiFetch("/api/subject-loads");
      if (Array.isArray(d?.subjectLoads)) setFaculty(d.subjectLoads);
    };

    load().catch(() => {});
    const onRefresh = () => load().catch(() => {});
    window.addEventListener("subject-loads:refresh", onRefresh);
    return () =>
      window.removeEventListener("subject-loads:refresh", onRefresh);
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      const d = await apiFetch("/api/departments");
      const list = Array.isArray(d?.departments) ? d.departments : [];
      if (list.length) {
        setDeptOptions(["All Departments", ...list]);
        return;
      }
      const local = Array.from(
        new Set((faculty || []).map((f) => f.dept).filter(Boolean)),
      ).sort();
      setDeptOptions(["All Departments", ...local]);
    };
    loadDepartments().catch(() => {});
  }, [faculty]);

  const visibleSubjectLoads = (faculty || []).filter((f) => {
    const depMatch = deptFilter === "All Departments" || f.dept === deptFilter;
    const q = searchText.trim().toLowerCase();
    const searchMatch =
      !q ||
      [f.name, f.id, f.dept, f.subjects]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    return depMatch && searchMatch;
  });

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
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <span style={{ color: "#6b7280" }}>{s.icon}</span>
              {badge(s.tag, s.tagColor)}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: "#111827" }}>
              {s.value}
            </div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>{s.label}</div>
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
        <div style={{ padding: "12px 18px", background: SIDEBAR_BG, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: 700, fontSize: 14, color: "#fff", margin: 0 }}>
            Faculty Subject Load — Spring 2026
          </h3>
          {user?.role === "admin" && (
            <button
              style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("modal:open", {
                    detail: {
                      type: "form",
                      title: "New Subject Load",
                      primaryColor: "#3b82f6",
                      submitLabel: "Add Load",
                      initialValues: { name: "", id: "", dept: "", subjects: "", units: 0, hrs: "0 hrs", sections: 1, status: "Normal", initials: "" },
                      fields: subjectLoadFields,
                      onSubmit: async (vals) => {
                        try {
                          await apiFetch("/api/subject-loads", {
                            method: "POST",
                            body: JSON.stringify({ ...vals, units: Number(vals.units), sections: Number(vals.sections) })
                          });
                          toast.success("Subject load added.");
                          window.dispatchEvent(new Event("subject-loads:refresh"));
                        } catch (e) {
                          throw e;
                        }
                      }
                    }
                  })
                );
              }}
            >
              + Add Load
            </button>
          )}
        </div>
        <div
          style={{
            padding: "12px 16px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            placeholder="Search faculty or subject..."
            style={{ ...inputStyle, flex: 1 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
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
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {[
                "FACULTY",
                "DEPARTMENT",
                "SUBJECTS",
                "UNITS",
                "HOURS/WEEK",
                "SECTIONS",
                "STATUS",
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
            {visibleSubjectLoads.map((f) => (
              <tr
                key={f._id || f.name}
                style={{
                  borderTop: "1px solid #f3f4f6",
                  background: f.status === "Overload" ? "#fffbeb" : "",
                }}
              >
                <td style={{ padding: "14px 16px" }}>
                  <div
                    style={{ display: "flex", gap: 10, alignItems: "center" }}
                  >
                    <Avatar initials={f.initials} />
                    <div>
                      <div style={{ fontWeight: 600, color: "#111827" }}>
                        {f.name}
                      </div>
                      <div style={{ color: "#9ca3af", fontSize: 12 }}>
                        {f.id}
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "14px 16px", color: "#374151" }}>
                  {f.dept}
                </td>
                <td style={{ padding: "14px 16px", color: "#374151" }}>
                  {f.subjects}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      background:
                        f.status === "Overload" ? "#fef9c3" : "#e0e7ff",
                      color: f.status === "Overload" ? "#a16207" : SIDEBAR_BG,
                      borderRadius: 999,
                      padding: "3px 10px",
                      fontWeight: 700,
                      fontSize: 13,
                    }}
                  >
                    {f.units} units
                  </span>
                </td>
                <td style={{ padding: "14px 16px", color: "#374151" }}>
                  {f.hrs}
                </td>
                <td style={{ padding: "14px 16px", color: "#374151" }}>
                  {f.sections}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  {f.status === "Overload"
                    ? badge("⚠ Overload", "yellow")
                    : badge("✓ Normal", "green")}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      style={{ ...iconBtn, marginRight: 0 }}
                      onClick={() => {
                        alert(
                          `Faculty: ${f.name}\nID: ${f.id}\nSubjects: ${f.subjects}`,
                        );
                      }}
                    >
                      👁
                    </button>
                    {user?.role === "admin" && (
                      <>
                        <button
                          style={iconBtn}
                          onClick={() => {
                            if (!f._id) return;
                            window.dispatchEvent(
                              new CustomEvent("modal:open", {
                                detail: {
                                  type: "form",
                                  title: "Edit Subject Load",
                                  primaryColor: "#f59e0b",
                                  submitLabel: "Save Changes",
                                  initialValues: f,
                                  fields: subjectLoadFields,
                                  onSubmit: async (vals) => {
                                    try {
                                      await apiFetch(`/api/subject-loads/${f._id}`, {
                                        method: "PUT",
                                        body: JSON.stringify({ ...vals, units: Number(vals.units), sections: Number(vals.sections) })
                                      });
                                      toast.success("Subject load updated.");
                                      window.dispatchEvent(new Event("subject-loads:refresh"));
                                    } catch (e) {
                                      throw e;
                                    }
                                  }
                                }
                              })
                            );
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          style={{ ...iconBtn, color: "#ef4444" }}
                          onClick={async () => {
                            if (!f._id) return;
                            const ok = confirm(`Delete subject load for ${f.name}?`);
                            if (!ok) return;
                            try {
                              await apiFetch(`/api/subject-loads/${f._id}`, {
                                method: "DELETE",
                              });
                              toast.success("Subject load deleted.");
                              window.dispatchEvent(new Event("subject-loads:refresh"));
                            } catch(e) {
                              toast.error(`Error deleting: ${e.message}`);
                            }
                          }}
                        >
                          🗑
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}