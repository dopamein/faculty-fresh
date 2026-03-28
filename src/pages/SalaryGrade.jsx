import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal, toast } from "../components/Shared";

export default function SalaryGrade() {
  const defaultGrades = [
    {
      grade: "SG-24",
      position: "Professor IV",
      steps: "8 Steps",
      base: "₱85,000",
      max: "₱120,000",
    },
    {
      grade: "SG-22",
      position: "Associate Professor IV",
      steps: "8 Steps",
      base: "₱65,000",
      max: "₱95,000",
    },
    {
      grade: "SG-19",
      position: "Assistant Professor IV",
      steps: "8 Steps",
      base: "₱45,000",
      max: "₱68,000",
    },
  ];
  const defaultAllowances = [
    {
      label: "Teaching Overload",
      sub: "Per credit hour beyond standard load",
      val: "₱2,500/hr",
    },
    {
      label: "Research Allowance",
      sub: "Monthly research stipend",
      val: "₱15,000/mo",
    },
    {
      label: "Administrative Load",
      sub: "Department head/coordinator role",
      val: "₱25,000/mo",
    },
  ];
  const defaultDeductions = [
    { label: "SSS Contribution", sub: "Social Security System", val: "4.5%" },
    { label: "PhilHealth", sub: "Health insurance premium", val: "2.75%" },
    { label: "Pag-IBIG", sub: "Home development mutual fund", val: "2%" },
  ];
  const [grades, setGrades] = useState(defaultGrades);
  const [allowances, setAllowances] = useState(defaultAllowances);
  const [deductions, setDeductions] = useState(defaultDeductions);

  const reload = async () => {
    const [g, a, d] = await Promise.all([
      apiFetch("/api/salary/grades"),
      apiFetch("/api/salary/allowances"),
      apiFetch("/api/salary/deductions"),
    ]);

    if (Array.isArray(g?.grades)) setGrades(g.grades);
    if (Array.isArray(a?.allowances)) setAllowances(a.allowances);
    if (Array.isArray(d?.deductions)) setDeductions(d.deductions);
  };

  useEffect(() => {
    reload().catch(() => {});
    const onRefresh = () => reload().catch(() => {});
    window.addEventListener("salary:refresh", onRefresh);
    return () => window.removeEventListener("salary:refresh", onRefresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gradeFields = [
    { name: "grade", label: "Grade (e.g., SG-24)", type: "text" },
    { name: "position", label: "Position", type: "text" },
    { name: "steps", label: "Steps", type: "text" },
    { name: "base", label: "Base salary", type: "text" },
    { name: "max", label: "Max salary", type: "text", fullWidth: true },
  ];

  const itemFields = [
    { name: "label", label: "Name", type: "text" },
    { name: "sub", label: "Description", type: "text" },
    { name: "val", label: "Value (e.g. ₱2,500/hr, 4.5%)", type: "text" },
  ];

  return (
    <div>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            padding: "12px 18px",
            background: SIDEBAR_BG,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
            Salary Grade Tables
          </h3>
          <button
            style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("modal:open", {
                  detail: {
                    type: "form",
                    title: "New Salary Grade",
                    primaryColor: "#3b82f6",
                    submitLabel: "Create Grade",
                    initialValues: {
                      grade: "",
                      position: "",
                      steps: "8 Steps",
                      base: "",
                      max: "",
                    },
                    fields: gradeFields,
                    onSubmit: async (vals) => {
                      if (!vals.grade || !vals.position || !vals.steps || !vals.base || !vals.max) {
                        throw new Error("Please fill out all required fields.");
                      }
                      try {
                        await apiFetch("/api/salary/grades", {
                          method: "POST",
                          body: JSON.stringify({
                            grade: vals.grade,
                            position: vals.position,
                            steps: vals.steps,
                            base: vals.base,
                            max: vals.max,
                            status: "Active",
                          }),
                        });
                        toast.success("Salary grade created");
                        window.dispatchEvent(new Event("salary:refresh"));
                      } catch (e) {
                        throw e;
                      }
                    },
                  },
                }),
              )
            }
          >
            + Add Grade
          </button>
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              {[
                "GRADE",
                "POSITION",
                "STEPS",
                "BASE SALARY",
                "MAX SALARY",
                "STATUS",
                "ACTIONS",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "10px 20px",
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
            {grades.map((g) => (
              <tr key={g.grade} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td
                  style={{
                    padding: "14px 20px",
                    fontWeight: 700,
                    color: SIDEBAR_BG,
                  }}
                >
                  {g.grade}
                </td>
                <td style={{ padding: "14px 20px", color: "#374151" }}>
                  {g.position}
                </td>
                <td style={{ padding: "14px 20px", color: "#374151" }}>
                  {g.steps}
                </td>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>
                  {g.base}
                </td>
                <td style={{ padding: "14px 20px", fontWeight: 600 }}>
                  {g.max}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  {badge("Active", "green")}
                </td>
                <td style={{ padding: "14px 20px" }}>
                  <button
                    style={{ ...iconBtn, marginRight: 4 }}
                    onClick={() => {
                      alert(
                        `Grade: ${g.grade}\nPosition: ${g.position}\nSteps: ${g.steps}\nBase: ${g.base}\nMax: ${g.max}`,
                      );
                    }}
                  >
                    👁
                  </button>
                  <button
                    style={iconBtn}
                    onClick={() => {
                      if (!g._id) return;
                      window.dispatchEvent(
                        new CustomEvent("modal:open", {
                          detail: {
                            type: "form",
                            title: "Edit Salary Grade",
                            primaryColor: "#f59e0b",
                            submitLabel: "Save Changes",
                            initialValues: g,
                            fields: gradeFields,
                            onSubmit: async (vals) => {
                              try {
                                await apiFetch(`/api/salary/grades/${g._id}`, {
                                  method: "PUT",
                                  body: JSON.stringify({
                                    position: vals.position,
                                    steps: vals.steps,
                                    base: vals.base,
                                    max: vals.max,
                                    status: "Active",
                                  }),
                                });
                                toast.success("Grade updated");
                                window.dispatchEvent(new Event("salary:refresh"));
                              } catch(e) { throw e; }
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
                      const ok = confirm(`Delete grade ${g.grade}?`);
                      if (!ok || !g._id) return;
                      try {
                        await apiFetch(`/api/salary/grades/${g._id}`, {
                          method: "DELETE",
                        });
                        toast.success("Grade deleted");
                        window.dispatchEvent(new Event("salary:refresh"));
                      } catch(e) {
                        toast.error(`Error: ${e.message}`);
                      }
                    }}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          {
            title: "Allowances & Benefits",
            items: allowances,
            valColor: "#22c55e",
          },
          { title: "Deductions", items: deductions, valColor: "#ef4444" },
        ].map((section) => (
          <div
            key={section.title}
            style={{
              background: "#fff",
              borderRadius: 8,
              border: "1px solid #e5e7eb",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "12px 18px", background: SIDEBAR_BG, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "#fff", margin: 0 }}>
                {section.title}
              </h3>
              <button
                style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG, padding: "4px 8px", fontSize: 12 }}
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("modal:open", {
                      detail: {
                        type: "form",
                        title: `New ${section.title}`,
                        primaryColor: section.valColor,
                        submitLabel: "Create",
                        initialValues: { label: "", sub: "", val: "" },
                        fields: itemFields,
                        onSubmit: async (vals) => {
                          const base = section.title === "Allowances & Benefits" ? "/api/salary/allowances" : "/api/salary/deductions";
                          try {
                            await apiFetch(base, {
                              method: "POST",
                              body: JSON.stringify(vals),
                            });
                            toast.success(`Created successfully`);
                            window.dispatchEvent(new Event("salary:refresh"));
                          } catch (e) { throw e; }
                        }
                      }
                    })
                  );
                }}
              >
                + Add
              </button>
            </div>
            <div style={{ padding: 16 }}>
              {section.items.map((item) => (
                <div
                  key={item.label}
                  style={{
                    border: "1px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "12px 14px",
                    marginBottom: 10,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "#111827",
                        fontSize: 14,
                      }}
                    >
                      {item.label}
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: 12 }}>
                      {item.sub}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                    <div
                      style={{
                        fontWeight: 700,
                        color: section.valColor,
                        fontSize: 14,
                      }}
                    >
                      {item.val}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        style={iconBtn}
                        onClick={() => {
                          if (!item._id) return;
                          window.dispatchEvent(
                            new CustomEvent("modal:open", {
                              detail: {
                                type: "form",
                                title: `Edit ${item.label}`,
                                primaryColor: "#f59e0b",
                                submitLabel: "Save",
                                initialValues: item,
                                fields: itemFields,
                                onSubmit: async (vals) => {
                                  try {
                                    const base = section.title === "Allowances & Benefits" ? "/api/salary/allowances" : "/api/salary/deductions";
                                    await apiFetch(`${base}/${item._id}`, {
                                      method: "PUT",
                                      body: JSON.stringify(vals),
                                    });
                                    toast.success("Updated successfully");
                                    window.dispatchEvent(new Event("salary:refresh"));
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
                        style={{ ...iconBtn, color: "#ef4444" }}
                        onClick={async () => {
                          if (!item._id) return;
                          const ok = confirm(`Delete ${item.label}?`);
                          if (!ok) return;
                          try {
                            const base = section.title === "Allowances & Benefits" ? "/api/salary/allowances" : "/api/salary/deductions";
                            await apiFetch(`${base}/${item._id}`, { method: "DELETE" });
                            toast.success("Deleted successfully");
                            window.dispatchEvent(new Event("salary:refresh"));
                          } catch (e) {
                            toast.error(`Error: ${e.message}`);
                          }
                        }}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}