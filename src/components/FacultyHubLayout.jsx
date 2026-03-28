import React, { useState, useEffect, Suspense } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "./Shared";

// We will inject the page component dynamically from App.jsx so we pass it as children
export default function FacultyHubLayout({ user, onLogout, modalState, setModalState, activeTopNav, setActiveTopNav, children, activePage }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isAdmin = user?.role === "admin";
  
  const PAGE_TITLES = {
    dashboard: { title: "Dashboard", sub: "Welcome back, overview of your faculty management system", btn: "" },
    faculty: { title: "Faculty Directory", sub: "Manage and view all faculty members across departments", btn: isAdmin ? "+ Add Faculty" : "" },
    subjects: { title: "Subject Load Tracker", sub: "Manage faculty teaching loads and assignments", btn: isAdmin ? "+ Assign Subject" : "" },
    schedule: { title: "Schedule Assignment", sub: "Manage faculty schedules and room assignments", btn: isAdmin ? "✓ Publish Schedule" : "" },
    attendance: { title: "Attendance Monitoring", sub: "Track faculty attendance and resolve exceptions", btn: isAdmin ? "↑ Export Timesheets" : "" },
    leave: { title: "Leave Application & Approval", sub: "Manage faculty leave requests and approvals", btn: "+ New Application" },
    salary: { title: "Salary Grade & Pay Setup", sub: "Configure faculty payroll grades, steps, and allowances", btn: isAdmin ? "+ New Grade" : "" },
    history: { title: "Teaching History", sub: "Faculty teaching assignments and performance archive", btn: isAdmin ? "↑ Export Report" : "" },
    clearance: { title: "Clearance System", sub: "Manage faculty clearance and requirements", btn: isAdmin ? "+ New Clearance" : "" },
    evaluation: { title: "Evaluation Summary", sub: "Faculty performance analytics and evaluation insights", btn: isAdmin ? "↑ Export Report" : "" },
  };
  
  const meta = PAGE_TITLES[activePage] || { title: "Menu", sub: "", btn: "" };

  const handleMetaClick = async () => {
    if (activePage === "dashboard") {
      navigate("/faculty");
      return;
    }

    if (activePage === "faculty") {
      setModalState({
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
      });
      return;
    }

    if (activePage === "subjects") {
      setModalState({
        type: "form",
        title: "Assign Subject Load",
        primaryColor: "#8b5cf6",
        submitLabel: "Create Subject Load",
        initialValues: {
          id: "",
          name: "",
          dept: "",
          subjects: "",
          units: "18",
          hrs: "18 hrs",
          sections: "3",
          status: "Normal",
          initials: "",
        },
        fields: [
          { name: "id", label: "Faculty ID (e.g., FAC-2026-0123)", type: "text" },
          { name: "name", label: "Faculty name", type: "text" },
          { name: "dept", label: "Department", type: "text" },
          { name: "subjects", label: "Subjects (comma-separated)", type: "text", fullWidth: true },
          { name: "units", label: "Total units", type: "text" },
          { name: "hrs", label: "Hours per week (e.g., 18 hrs)", type: "text" },
          { name: "sections", label: "Sections", type: "text" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "Normal", label: "Normal" },
              { value: "Overload", label: "Overload" },
            ],
          },
          { name: "initials", label: "Initials", type: "text", fullWidth: true },
        ],
        onSubmit: async (vals) => {
          const units = Number(vals.units);
          const sections = Number(vals.sections);
          if (
            !vals.id ||
            !vals.name ||
            !vals.dept ||
            !vals.subjects ||
            !Number.isFinite(units) ||
            !vals.hrs ||
            !Number.isFinite(sections) ||
            !vals.status ||
            !vals.initials
          ) {
            throw new Error("Please fill out all required fields with valid numbers.");
          }
          await apiFetch("/api/subject-loads", {
            method: "POST",
            body: JSON.stringify({
              id: vals.id,
              name: vals.name,
              dept: vals.dept,
              subjects: vals.subjects,
              units,
              hrs: vals.hrs,
              sections,
              status: vals.status,
              initials: vals.initials,
            }),
          });
          window.dispatchEvent(new Event("subject-loads:refresh"));
        },
      });
      return;
    }

    if (activePage === "leave") {
      setModalState({
        type: "form",
        title: "New Leave Application",
        primaryColor: "#22c55e",
        submitLabel: "Submit Leave",
        initialValues: {
          facultyName: "",
          dept: "",
          type: "Sick Leave",
          startDate: "",
          endDate: "",
          durationLabel: "",
          initials: "",
          tagColor: "yellow",
          submittedAtLabel: "just now",
          reason: "",
        },
        fields: [
          { name: "facultyName", label: "Faculty name", type: "text" },
          { name: "dept", label: "Department", type: "text" },
          {
            name: "type",
            label: "Leave type",
            type: "select",
            options: [
              { value: "Sick Leave", label: "Sick Leave" },
              { value: "Vacation", label: "Vacation" },
              { value: "Personal", label: "Personal" },
              { value: "Conference", label: "Conference" },
            ],
          },
          { name: "startDate", label: "Start date label", type: "text" },
          { name: "endDate", label: "End date label", type: "text" },
          { name: "durationLabel", label: "Duration label (e.g., 3 Days)", type: "text" },
          { name: "initials", label: "Initials", type: "text" },
          {
            name: "tagColor",
            label: "Badge color",
            type: "select",
            options: [
              { value: "yellow", label: "yellow" },
              { value: "green", label: "green" },
              { value: "blue", label: "blue" },
              { value: "red", label: "red" },
            ],
          },
          { name: "submittedAtLabel", label: "Submitted label", type: "text" },
          { name: "reason", label: "Reason (optional)", type: "textarea", fullWidth: true },
        ],
        onSubmit: async (vals) => {
          if (
            !vals.facultyName ||
            !vals.dept ||
            !vals.type ||
            !vals.startDate ||
            !vals.endDate ||
            !vals.durationLabel ||
            !vals.initials
          ) {
            throw new Error("Please fill out all required fields.");
          }
          await apiFetch("/api/leaves", {
            method: "POST",
            body: JSON.stringify({
              facultyName: vals.facultyName,
              dept: vals.dept,
              status: "Pending",
              type: vals.type,
              reason: vals.reason || "",
              startDate: vals.startDate,
              endDate: vals.endDate,
              durationLabel: vals.durationLabel,
              submittedAtLabel: vals.submittedAtLabel || "just now",
              initials: vals.initials,
              tagColor: vals.tagColor || "yellow",
            }),
          });
          window.dispatchEvent(new Event("leaves:refresh"));
        },
      });
      return;
    }

    if (activePage === "salary") {
      setModalState({
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
        fields: [
          { name: "grade", label: "Grade (e.g., SG-24)", type: "text" },
          { name: "position", label: "Position", type: "text" },
          { name: "steps", label: "Steps", type: "text" },
          { name: "base", label: "Base salary", type: "text", fullWidth: false },
          { name: "max", label: "Max salary", type: "text", fullWidth: true },
        ],
        onSubmit: async (vals) => {
          if (!vals.grade || !vals.position || !vals.steps || !vals.base || !vals.max) {
            throw new Error("Please fill out all required fields.");
          }
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
          window.dispatchEvent(new Event("salary:refresh"));
        },
      });
      return;
    }

    if (activePage === "schedule") {
      window.dispatchEvent(new Event("schedule:publish"));
      return;
    }

    if (activePage === "attendance") {
      const d = await apiFetch("/api/attendance/trend?term=Spring%202026");
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance-timesheet.json";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (activePage === "history") {
      const d = await apiFetch("/api/teaching-history?page=1&limit=1000");
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "teaching-history-export.json";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (activePage === "evaluation") {
      const d = await apiFetch("/api/evaluations/summary");
      const blob = new Blob([JSON.stringify(d, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "evaluation-summary.json";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    if (activePage === "clearance") {
      setModalState({
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
          { name: "requirements", label: "Requirements (comma-separated)", type: "textarea", fullWidth: true },
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
      });
      return;
    }
  };

  useEffect(() => {
    const onOpen = (e) => {
      // Expecting: e.detail = { type: "form", title, fields, initialValues, onSubmit, ... }
      if (!e?.detail) return;
      setModalState(e.detail);
    };
    window.addEventListener("modal:open", onOpen);
    return () => window.removeEventListener("modal:open", onOpen);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "'Segoe UI', sans-serif",
        background: CONTENT_BG,
        fontSize: 14,
      }}
    >
      {modalState?.type === "form" && (
        <FormModal
          state={modalState}
          onClose={() => setModalState(null)}
        />
      )}
      {/* TOP NAV */}
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #e5e7eb",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          height: 48,
          flexShrink: 0,
          zIndex: 10,
        }}
      >
        <img
          src={LOGO_SRC}
          alt="BCP Logo"
          style={{
            width: 36,
            height: 36,
            objectFit: "contain",
            marginRight: 12,
            flexShrink: 0,
          }}
        />
        {["Faculty Hub Home", "Quick Actions", "Resources", "Help"].map((link) => (
          <button
            key={link}
            onClick={() => setActiveTopNav(link)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0 14px",
              height: 48,
              fontSize: 13,
              fontWeight: activeTopNav === link ? 700 : 400,
              color: activeTopNav === link ? SIDEBAR_BG : "#374151",
              borderBottom:
                activeTopNav === link
                  ? `3px solid ${SIDEBAR_BG}`
                  : "3px solid transparent",
            }}
          >
            {link}
          </button>
        ))}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </button>
          <Avatar initials="JA" size={30} />
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* SIDEBAR */}
        <aside
          style={{
            width: 220,
            background: SIDEBAR_BG,
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <img
              src={LOGO_SRC}
              alt="BCP Logo"
              style={{
                width: 80,
                height: 80,
                objectFit: "contain",
                marginBottom: 10,
              }}
            />
            <div
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
                textAlign: "center",
              }}
            >
              {" "}
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}></div>
          </div>
          <nav style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {NAV_ITEMS.filter(i => isAdmin || i.id !== "salary").map((item) => {
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate("/" + item.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    padding: "9px 12px",
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    background: active
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                    color: active ? "#fff" : "rgba(255,255,255,0.6)",
                    fontWeight: active ? 700 : 400,
                    fontSize: 13,
                    textAlign: "left",
                    marginBottom: 2,
                    borderLeft: active
                      ? "3px solid #fff"
                      : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!active)
                      e.currentTarget.style.background =
                        "rgba(255,255,255,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    if (!active)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <span style={{ flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontSize: 12 }}>{item.label}</span>
                </button>
              );
            })}
          </nav>
          <div
            style={{
              padding: "12px 14px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Avatar initials="AU" size={32} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 12, color: "#fff" }}>
                {user?.username || "Admin User"}
              </div>
              <button 
                onClick={onLogout}
                style={{ background: "transparent", border: "none", padding: 0, color: "rgba(255,255,255,0.6)", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderBottom: "1px solid #e5e7eb",
              padding: "12px 24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            <div>
              <h1
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                  color: "#111827",
                  margin: 0,
                }}
              >
                {meta.title}
              </h1>
              <p style={{ color: "#6b7280", fontSize: 12, margin: 0 }}>
                {meta.sub}
              </p>
            </div>
            <button style={{ ...btnPrimary }} onClick={handleMetaClick}>
              {meta.btn}
            </button>
          </div>
          <main style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}