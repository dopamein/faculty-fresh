import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

export default function ScheduleAssignment() {
  const times = [
    "7:00 AM",
    "9:00 AM",
    "11:00 AM",
    "1:00 PM",
    "3:00 PM",
    "5:00 PM",
  ];
  const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"];
  const defaultSlots = {
    "9:00 AM-TUESDAY": {
      code: "CS401",
      prof: "Prof. Gomez",
      room: "Room 301",
      color: SIDEBAR_BG,
    },
    "9:00 AM-MONDAY": {
      code: "MATH201",
      prof: "Prof. Abai",
      room: "Room 102",
      color: ACCENT,
    },
    "9:00 AM-WEDNESDAY": {
      code: "MATH301",
      prof: "Prof. Abai",
      room: "Room 102",
      color: ACCENT,
    },
    "11:00 AM-TUESDAY": {
      code: "BUS101",
      prof: "Prof. Supafly",
      room: "Room 401",
      color: "#f59e0b",
    },
    "11:00 AM-THURSDAY": {
      code: "BUS101",
      prof: "Prof. Supafly",
      room: "Room 401",
      color: "#f59e0b",
    },
    "1:00 PM-MONDAY": {
      code: "CS502",
      prof: "Prof. Gomez",
      room: "Room 302",
      color: SIDEBAR_BG,
    },
    "1:00 PM-WEDNESDAY": {
      code: "CS301",
      prof: "Prof. Gomez",
      room: "Room 301",
      color: SIDEBAR_BG,
    },
    "3:00 PM-TUESDAY": {
      code: "ENG401",
      prof: "Prof. Mulet",
      room: "Room 206",
      color: "#22c55e",
    },
    "3:00 PM-THURSDAY": {
      code: "ENG401",
      prof: "Prof. Mulet",
      room: "Room 206",
      color: "#22c55e",
    },
  };

  const [slots, setSlots] = useState(defaultSlots);

  useEffect(() => {
    const load = async () => {
      const d = await apiFetch("/api/schedules?term=Spring%202026");
      if (d?.slots && typeof d.slots === "object") setSlots(d.slots);
    };
    load().catch(() => {});
    const onRefresh = () => load().catch(() => {});
    window.addEventListener("schedules:refresh", onRefresh);
    return () => window.removeEventListener("schedules:refresh", onRefresh);
  }, []);

  useEffect(() => {
    const onPublish = async () => {
      const term = "Spring 2026";
      const payload = [];
      for (const t of times) {
        for (const d of days) {
          const slot = slots[`${t}-${d}`];
          if (!slot) continue;
          payload.push({
            time: t,
            day: d,
            code: slot.code,
            prof: slot.prof,
            room: slot.room,
            color: slot.color,
          });
        }
      }

      await apiFetch(`/api/schedules/${encodeURIComponent(term)}/publish`, {
        method: "POST",
        body: JSON.stringify({ slots: payload }),
      });
      window.dispatchEvent(new Event("schedules:refresh"));
    };

    window.addEventListener("schedule:publish", onPublish);
    return () => window.removeEventListener("schedule:publish", onPublish);
  }, [slots]);

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
        <h3 style={{ fontWeight: 700, fontSize: 14, color: "#fff" }}>
          Weekly Schedule — Spring 2026
        </h3>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr style={{ background: "#f9fafb" }}>
              <th
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  color: "#6b7280",
                  fontSize: 11,
                  fontWeight: 600,
                  width: 90,
                }}
              >
                TIME
              </th>
              {days.map((d) => (  
                <th
                  key={d}
                  style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    color: "#6b7280",
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((t) => (
              <tr key={t} style={{ borderTop: "1px solid #f3f4f6" }}>
                <td
                  style={{
                    padding: "8px 14px",
                    color: "#9ca3af",
                    fontSize: 12,
                    verticalAlign: "top",
                    paddingTop: 12,
                  }}
                >
                  {t}
                </td>
                {days.map((d) => {
                  const slot = slots[`${t}-${d}`];
                  return (
                    <td
                      key={d}
                      style={{ padding: 6, height: 72, verticalAlign: "top" }}
                    >
                      {slot && (
                        <div
                          style={{
                            background: slot.color,
                            color: "#fff",
                            borderRadius: 6,
                            padding: "8px 10px",
                            fontSize: 12,
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{slot.code}</div>
                          <div style={{ opacity: 0.85 }}>{slot.prof}</div>
                          <div style={{ opacity: 0.75 }}>{slot.room}</div>
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}