import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

export default function FacultyDirectory() {
  const defaultFaculty = [
    {
      name: "Prof. Jin Gomez",
      email: "jin@bcp.edu.ph",
      dept: "Network Implementation and Support II",
      rank: "Professor",
      emp: "Active",
      load: "18 Units",
      att: "Present",
      clear: "Pending",
      initials: "MC",
    },
    {
      name: "Prof. Supafly",
      email: "supafly@bcp.edu.ph",
      dept: "Business Process Management in IT",
      rank: "Associate Professor",
      emp: "Active",
      load: "21 Units",
      att: "Present",
      clear: "Completed",
      initials: "SW",
    },
    {
      name: "Prof. Cardo Mulet",
      email: "cardo@bcp.edu.ph",
      dept: "Information Assurance and Security 2",
      rank: "Professor",
      emp: "On Leave",
      load: "0 Units",
      att: "On Leave",
      clear: "Completed",
      initials: "JR",
    },
    {
      name: "Prof. Hev Abai",
      email: "hev@bcp.edu.ph",
      dept: "System Administration and Maintenance",
      rank: "Assistant Professor",
      emp: "Active",
      load: "15 Units",
      att: "Absent",
      clear: "Incomplete",
      initials: "ET",
    },
  ];
  const [faculty, setFaculty] = useState(defaultFaculty);
  const [searchText, setSearchText] = useState("");
  const [deptFilter, setDeptFilter] = useState("All Departments");
  const [deptOptions, setDeptOptions] = useState(["All Departments"]);

  useEffect(() => {
    const load = async () => {
      const d = await apiFetch("/api/faculty");
      if (Array.isArray(d?.faculty)) setFaculty(d.faculty);
    };

    load().catch(() => {});
    const onRefresh = () => load().catch(() => {});
    window.addEventListener("faculty:refresh", onRefresh);
    return () => window.removeEventListener("faculty:refresh", onRefresh);
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      const d = await apiFetch("/api/departments");
      const fromApi = Array.isArray(d?.departments) ? d.departments : [];
      if (fromApi.length) {
        setDeptOptions(["All Departments", ...fromApi]);
        return;
      }

      // fallback from local rows
      const local = Array.from(
        new Set((faculty || []).map((f) => f.dept).filter(Boolean)),
      ).sort();
      setDeptOptions(["All Departments", ...local]);
    };

    loadDepartments().catch(() => {});
  }, [faculty]);

  const empColor = { Active: "green", "On Leave": "yellow" };
  const attColor = { Present: "green", "On Leave": "yellow", Absent: "red" };
  const clrColor = { Completed: "green", Pending: "yellow", Incomplete: "red" };
  const visibleFaculty = (faculty || []).filter((f) => {
    const depMatch =
      deptFilter === "All Departments" || f.dept === deptFilter;
    const q = searchText.trim().toLowerCase();
    const searchMatch =
      !q ||
      [f.name, f.email, f.dept, f.rank]
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
      <div
        style={{
          padding: "14px 20px",
          background: SIDEBAR_BG,
          display: "flex",
          gap: 10,
        }}
      >
        <input
          placeholder="🔍 Search faculty..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            ...inputStyle,
            flex: 1,
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        />
        <select
          style={{
            ...selectStyle,
            background: "rgba(255,255,255,0.15)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
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
        <button
          style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
          onClick={() => {
            window.dispatchEvent(
              new CustomEvent("modal:open", {
                detail: {
                  type: "form",
                  title: "Add Faculty",
                  primaryColor: "#3b82f6",
                  submitLabel: "Create Faculty",
                  initialValues: {
                    name: "",
                    email: "",
                    dept: "",
                    rank: "",
                    emp: "Active",
                    load: "18 Units",
                    att: "Present",
                    clear: "Pending",
                    initials: "",
                  },
                  fields: [
                    { name: "name", label: "Faculty name", type: "text" },
                    { name: "email", label: "Email", type: "text" },
                    { name: "dept", label: "Department", type: "text" },
                    { name: "rank", label: "Rank", type: "text" },
                    {
                      name: "emp",
                      label: "Employment status",
                      type: "select",
                      options: [
                        { value: "Active", label: "Active" },
                        { value: "On Leave", label: "On Leave" },
                      ],
                    },
                    { name: "load", label: "Load (e.g., 18 Units)", type: "text" },
                    {
                      name: "att",
                      label: "Attendance",
                      type: "select",
                      options: [
                        { value: "Present", label: "Present" },
                        { value: "Absent", label: "Absent" },
                        { value: "On Leave", label: "On Leave" },
                      ],
                    },
                    {
                      name: "clear",
                      label: "Clearance",
                      type: "select",
                      options: [
                        { value: "Pending", label: "Pending" },
                        { value: "Completed", label: "Completed" },
                        { value: "Incomplete", label: "Incomplete" },
                      ],
                    },
                    { name: "initials", label: "Initials (e.g., MC)", type: "text", fullWidth: true },
                  ],
                  onSubmit: async (vals) => {
                    if (
                      !vals.name ||
                      !vals.email ||
                      !vals.dept ||
                      !vals.rank ||
                      !vals.emp ||
                      !vals.load ||
                      !vals.att ||
                      !vals.clear ||
                      !vals.initials
                    ) {
                      throw new Error("Please fill out all required fields.");
                    }

                    await apiFetch("/api/faculty", {
                      method: "POST",
                      body: JSON.stringify({
                        name: vals.name,
                        email: vals.email,
                        dept: vals.dept,
                        rank: vals.rank,
                        emp: vals.emp,
                        load: vals.load,
                        att: vals.att,
                        clear: vals.clear,
                        initials: vals.initials,
                      }),
                    });
                    window.dispatchEvent(new Event("faculty:refresh"));
                  },
                },
              }),
            );
          }}
        >
          + Add Faculty
        </button>
      </div>
      <table
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
      >
        <thead>
          <tr style={{ background: "#f9fafb" }}>
            {[
              "",
              "FACULTY",
              "DEPARTMENT",
              "RANK",
              "EMPLOYMENT",
              "LOAD",
              "ATTENDANCE",
              "CLEARANCE",
              "ACTIONS",
            ].map((h) => (
              <th
                key={h}
                style={{
                  padding: "10px 14px",
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
          {visibleFaculty.map((f) => (
            <tr
              key={f._id || f.name}
              style={{ borderTop: "1px solid #f3f4f6" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f9fafb")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "")}
            >
              <td style={{ padding: "12px 14px" }}>
                <Avatar initials={f.initials} />
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: 600, color: "#111827" }}>
                  {f.name}
                </div>
                <div style={{ color: "#9ca3af", fontSize: 12 }}>{f.email}</div>
              </td>
              <td style={{ padding: "12px 14px", color: "#374151" }}>
                {f.dept}
              </td>
              <td style={{ padding: "12px 14px", color: "#374151" }}>
                {f.rank}
              </td>
              <td style={{ padding: "12px 14px" }}>
                {badge(f.emp, empColor[f.emp] || "gray")}
              </td>
              <td style={{ padding: "12px 14px", color: "#374151" }}>
                {f.load}
              </td>
              <td style={{ padding: "12px 14px" }}>
                {badge(f.att, attColor[f.att] || "gray")}
              </td>
              <td style={{ padding: "12px 14px" }}>
                {badge(f.clear, clrColor[f.clear] || "gray")}
              </td>
              <td style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    style={iconBtn}
                    onClick={() => {
                      alert(
                        `Name: ${f.name}\nEmail: ${f.email}\nDept: ${f.dept}\nRank: ${f.rank}`,
                      );
                    }}
                  >
                    👁
                  </button>
                  <button
                    style={iconBtn}
                    onClick={async () => {
                      if (!f._id) return;
                      const name = prompt("Faculty name", f.name);
                      const email = prompt("Email", f.email);
                      const dept = prompt("Department", f.dept);
                      const rank = prompt("Rank", f.rank);
                      const emp = prompt("Employment status", f.emp);
                      const load = prompt("Load", f.load);
                      const att = prompt("Attendance", f.att);
                      const clear = prompt("Clearance", f.clear);
                      const initials = prompt("Initials", f.initials);

                      if (!name || !email || !dept || !rank || !emp || !load || !att || !clear || !initials)
                        return;

                      await apiFetch(`/api/faculty/${f._id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                          name,
                          email,
                          dept,
                          rank,
                          emp,
                          load,
                          att,
                          clear,
                          initials,
                        }),
                      });
                      window.dispatchEvent(new Event("faculty:refresh"));
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    style={{ ...iconBtn, color: "#ef4444" }}
                    onClick={async () => {
                      if (!f._id) return;
                      const ok = confirm(`Delete faculty ${f.name}?`);
                      if (!ok) return;
                      await apiFetch(`/api/faculty/${f._id}`, {
                        method: "DELETE",
                      });
                      window.dispatchEvent(new Event("faculty:refresh"));
                    }}
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}