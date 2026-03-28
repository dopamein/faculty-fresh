import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

export default function ClearanceSystem({ user }) {
  const [rows, setRows] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const load = async () => {
      const d = await apiFetch("/api/clearance");
      const data = Array.isArray(d?.clearances) ? d.clearances : [];
      setRows(data);
      if (!selectedId && data.length) setSelectedId(data[0]._id);
      if (selectedId && !data.some((x) => x._id === selectedId)) {
        setSelectedId(data.length ? data[0]._id : null);
      }
    };
    load().catch(() => {});
    const onRefresh = () => load().catch(() => {});
    window.addEventListener("clearance:refresh", onRefresh);
    return () => window.removeEventListener("clearance:refresh", onRefresh);
  }, [selectedId]);

  const selected = rows.find((r) => r._id === selectedId) || null;
  const statusColor = (s) => (s === "Completed" ? "green" : "yellow");

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20 }}>
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
            padding: "12px 18px",
            background: SIDEBAR_BG,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
            Clearance System
          </h3>
          {user?.role === "admin" && (
            <button
              style={{ ...btnPrimary, background: "#fff", color: SIDEBAR_BG }}
              onClick={() => {
                window.dispatchEvent(
                  new CustomEvent("modal:open", {
                    detail: {
                      type: "form",
                      title: "New Clearance",
                      primaryColor: "#3b82f6",
                      submitLabel: "Create Clearance",
                      initialValues: {
                        facultyName: "",
                        status: "Pending",
                        requirements: "Leave clearance, Document verification",
                      },
                      fields: [
                        { name: "facultyName", label: "Faculty name", type: "text" },
                        {
                          name: "status",
                          label: "Status",
                          type: "select",
                          options: [
                            { value: "Pending", label: "Pending" },
                            { value: "Completed", label: "Completed" },
                          ],
                        },
                        {
                          name: "requirements",
                          label: "Requirements (comma-separated)",
                          type: "textarea",
                          fullWidth: true,
                        },
                      ],
                      onSubmit: async (vals) => {
                        if (!vals.facultyName || !vals.status) {
                          throw new Error("Please fill out all required fields.");
                        }
                        const requirements = (vals.requirements || "")
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        await apiFetch("/api/clearance", {
                          method: "POST",
                          body: JSON.stringify({
                            facultyName: vals.facultyName,
                            status: vals.status,
                            requirements,
                          }),
                        });
                        window.dispatchEvent(new Event("clearance:refresh"));
                      },
                    },
                  }),
                );
              }}
            >
              + New Clearance
            </button>
          )}
        </div>

        {rows.map((r) => (
          <div
            key={r._id}
            onClick={() => setSelectedId(r._id)}
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid #f3f4f6",
              cursor: "pointer",
              background: selectedId === r._id ? "#eff6ff" : "",
              borderLeft:
                selectedId === r._id
                  ? `3px solid ${SIDEBAR_BG}`
                  : "3px solid transparent",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: "#111827", fontSize: 14 }}>
                  {r.facultyName}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  {Array.isArray(r.requirements) ? r.requirements.length : 0} requirements
                </div>
              </div>
              <div>{badge(r.status || "Pending", statusColor(r.status))}</div>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          border: "1px solid #e5e7eb",
          padding: 20,
          height: "fit-content",
        }}
      >
        {!selected ? (
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Select a clearance to view details.
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>
                {selected.facultyName}
              </div>
              {badge(selected.status || "Pending", statusColor(selected.status))}
            </div>

            <h4 style={{ fontWeight: 700, fontSize: 13, color: "#374151", marginBottom: 8 }}>
              Application Details
            </h4>
            <div style={{ color: "#111827", fontSize: 13, lineHeight: 1.6 }}>
              {Array.isArray(selected.requirements) && selected.requirements.length ? (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {selected.requirements.map((req, idx) => (
                    <li key={`${req}-${idx}`}>{req}</li>
                  ))}
                </ul>
              ) : (
                <span style={{ color: "#6b7280" }}>No requirements listed.</span>
              )}
            </div>

            {user?.role === "admin" && (
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button
                  style={{ ...btnPrimary, background: "#22c55e" }}
                  onClick={async () => {
                    await apiFetch(`/api/clearance/${selected._id}`, {
                      method: "PUT",
                      body: JSON.stringify({
                        facultyName: selected.facultyName,
                        status: "Completed",
                        requirements: selected.requirements || [],
                      }),
                    });
                    window.dispatchEvent(new Event("clearance:refresh"));
                  }}
                >
                  ✓ Mark Completed
                </button>
                <button
                  style={{ ...btnPrimary, background: "#ef4444" }}
                  onClick={async () => {
                    await apiFetch(`/api/clearance/${selected._id}`, { method: "DELETE" });
                    window.dispatchEvent(new Event("clearance:refresh"));
                  }}
                >
                  🗑 Delete
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}