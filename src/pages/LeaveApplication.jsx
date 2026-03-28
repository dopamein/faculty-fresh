import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal, toast } from "../components/Shared";

export default function LeaveApplication({ user }) {
  const [selected, setSelected] = useState(0);
  const defaultApps = [
    {
      name: "Prof. Jin Gomez",
      dept: "Network Implementation and Support II",
      status: "Pending",
      time: "2 hours ago",
      dates: "Mar 20-22, 2026",
      type: "Sick Leave",
      initials: "MC",
      tagColor: "yellow",
      startDate: "March 20, 2026",
      endDate: "March 22, 2026",
      durationLabel: "3 Days",
    },
    {
      name: "Prof. Supafly",
      dept: "Business Process Management in IT",
      status: "Approved",
      time: "1 day ago",
      dates: "Mar 25-29, 2026",
      type: "Vacation",
      initials: "SJ",
      tagColor: "green",
      startDate: "March 25, 2026",
      endDate: "March 29, 2026",
      durationLabel: "5 Days",
    },
    {
      name: "Prof. Cardo Mulet",
      dept: "Information Assurance and Security 2",
      status: "Under Review",
      time: "3 hours ago",
      dates: "Apr 1-3, 2026",
      type: "Conference",
      initials: "RM",
      tagColor: "blue",
      startDate: "April 1, 2026",
      endDate: "April 3, 2026",
      durationLabel: "3 Days",
    },
    {
      name: "Prof. Hev Abai",
      dept: "Biology",
      status: "Needs Info",
      time: "5 hours ago",
      dates: "Mar 28-30, 2026",
      type: "Personal",
      initials: "ED",
      tagColor: "red",
      startDate: "March 28, 2026",
      endDate: "March 30, 2026",
      durationLabel: "3 Days",
    },
  ];

  const [apps, setApps] = useState(defaultApps);
  const a = apps[selected];

  const reload = async () => {
    const d = await apiFetch("/api/leaves");
    const leaves = Array.isArray(d?.leaves) ? d.leaves : [];
    const mapped = leaves.map((l) => ({
      _id: l._id,
      name: l.facultyName,
      dept: l.dept,
      status: l.status,
      time: l.submittedAtLabel,
      dates: `${l.startDate} - ${l.endDate}`,
      type: l.type,
      initials: l.initials,
      tagColor: l.tagColor,
      startDate: l.startDate,
      endDate: l.endDate,
      durationLabel: l.durationLabel,
    }));
    setApps(mapped.length ? mapped : defaultApps);
    setSelected((prev) => Math.min(prev, Math.max(0, mapped.length - 1)));
  };

  useEffect(() => {
    reload().catch(() => {});
    const onRefresh = () => reload().catch(() => {});
    window.addEventListener("leaves:refresh", onRefresh);
    return () => window.removeEventListener("leaves:refresh", onRefresh);
  }, []);

  const balance = [
    { type: "Sick Leave", used: 3, total: 12, color: "#22c55e", pct: 75 },
    { type: "Vacation", used: 10, total: 20, color: SIDEBAR_BG, pct: 50 },
    { type: "Personal", used: 0, total: 5, color: ACCENT, pct: 0 },
  ];
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
        <div style={{ padding: "14px 20px", background: SIDEBAR_BG }}>
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>
            Leave Applications{" "}
            <span
              style={{
                background: "#ef4444",
                color: "#fff",
                borderRadius: 999,
                padding: "2px 8px",
                fontSize: 12,
              }}
            >
              18 pending
            </span>
          </h3>
        </div>
        {apps.map((ap, i) => (
          <div
            key={ap._id || ap.name}
            onClick={() => setSelected(i)}
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #f3f4f6",
              cursor: "pointer",
              background: selected === i ? "#f0eeff" : "",
              borderLeft:
                selected === i
                  ? `3px solid ${SIDEBAR_BG}`
                  : "3px solid transparent",
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <Avatar initials={ap.initials} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 8, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        color: "#111827",
                        fontSize: 14,
                      }}
                    >
                      {ap.name}
                    </span>
                    {badge(ap.status, ap.tagColor)}
                  </div>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>
                    {ap.time}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>
                  {ap.dept} · {ap.dates} · {ap.type}
                </div>
              </div>
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
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3 style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
            Application Details
          </h3>
          <div style={{ display: "flex", gap: 6 }}>
            {user?.role === "admin" && (
              <>
                <button
                  style={{ ...btnPrimary, background: "#ef4444" }}
                  onClick={async () => {
                    if (!a?._id) return;
                    if (!window.confirm("Deny this leave?")) return;
                    try {
                      await apiFetch(`/api/leaves/${a._id}/deny`, { method: "POST" });
                      toast.success("Leave request denied.");
                      await reload();
                    } catch (e) {
                      toast.error(`Error denying leave: ${e.message}`);
                    }
                  }}
                >
                  ✕ Deny
                </button>
                <button
                  style={{ ...btnPrimary, background: "#22c55e" }}
                  onClick={async () => {
                    if (!a?._id) return;
                    try {
                      await apiFetch(`/api/leaves/${a._id}/approve`, { method: "POST" });
                      toast.success("Leave request approved!");
                      await reload();
                    } catch (e) {
                      toast.error(`Error approving leave: ${e.message}`);
                    }
                  }}
                >
                  ✓ Approve
                </button>
                <button
                  style={{ ...btnOutline, color: "#ef4444" }}
                  onClick={async () => {
                    if (!a?._id) return;
                    if (!window.confirm("Permanently delete this application?")) return;
                    try {
                      await apiFetch(`/api/leaves/${a._id}`, { method: "DELETE" });
                      toast.success("Application deleted.");
                      await reload();
                    } catch(e) {
                      toast.error(`Error: ${e.message}`);
                    }
                  }}
                >
                  🗑
                </button>
              </>
            )}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 14,
            paddingBottom: 14,
            borderBottom: "1px solid #f3f4f6",
          }}
        >
          <Avatar initials={a.initials} size={48} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>
              {a.name}
            </div>
            <div style={{ color: "#6b7280", fontSize: 13 }}>{a.dept}</div>
            {badge(a.status, a.tagColor)}
          </div>
        </div>
        {[
          ["Type:", a.type],
          ["Start Date:", a.startDate],
          ["End Date:", a.endDate],
          ["Duration:", a.durationLabel],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 13,
            }}
          >
            <span style={{ color: "#6b7280" }}>{k}</span>
            <span style={{ color: "#111827", fontWeight: 500 }}>{v}</span>
          </div>
        ))}
        <h4
          style={{
            fontWeight: 600,
            fontSize: 13,
            color: "#374151",
            margin: "14px 0 10px",
          }}
        >
          Leave Balance
        </h4>
        {balance.map((b) => (
          <div key={b.type} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
                fontSize: 13,
              }}
            >
              <span style={{ color: "#374151" }}>{b.type}</span>
              <span style={{ color: "#6b7280" }}>
                {b.used}/{b.total} days
              </span>
            </div>
            <div style={{ background: "#f3f4f6", borderRadius: 99, height: 6 }}>
              <div
                style={{
                  width: `${b.pct}%`,
                  height: 6,
                  borderRadius: 99,
                  background: b.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}