const fs = require('fs');

const code = fs.readFileSync('src/App.jsx', 'utf8').split('\n');

const bounds = [
  { name: 'FormModal', start: 257, end: 426 },
  { name: 'Dashboard', start: 428, end: 816 },
  { name: 'FacultyDirectory', start: 818, end: 1195 },
  { name: 'SubjectLoadTracker', start: 1197, end: 1553 },
  { name: 'ScheduleAssignment', start: 1555, end: 1759 },
  { name: 'AttendanceMonitoring', start: 1761, end: 1949 },
  { name: 'LeaveApplication', start: 1951, end: 2241 },
  { name: 'SalaryGrade', start: 2243, end: 2603 },
  { name: 'TeachingHistory', start: 2605, end: 2900 },
  { name: 'ClearanceSystem', start: 2902, end: 3106 },
  { name: 'EvaluationSummary', start: 3108, end: 3425 },
  { name: 'Login', start: 3427, end: 3530 },
  { name: 'ProtectedRoute', start: 3532, end: 3537 },
  { name: 'FacultyHubLayout', start: 3539, end: 4210 },
  { name: 'FacultyHub', start: 4212, end: 4257 }
];

const getCode = (start, end) => code.slice(start - 1, end).join('\n');

const sharedHead = code.slice(0, 256).join('\n');
const sharedTail = 
`
export {
  SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar,
  apiFetch, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn
};
`;

const iconsAndConstants = sharedHead + "\n" + getCode(3532, 3537) + "\n" + getCode(257, 426) + sharedTail + "\nexport { ProtectedRoute, FormModal };\n";

fs.writeFileSync('src/components/Shared.jsx', iconsAndConstants);

const pages = [
  'Dashboard', 'FacultyDirectory', 'SubjectLoadTracker', 'ScheduleAssignment',
  'AttendanceMonitoring', 'LeaveApplication', 'SalaryGrade', 'TeachingHistory',
  'ClearanceSystem', 'EvaluationSummary', 'Login'
];

pages.forEach(page => {
  const b = bounds.find(c => c.name === page);
  const imports = `import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

export default `;
  fs.writeFileSync(`src/pages/${page}.jsx`, imports + getCode(b.start, b.end));
});

// FacultyHubLayout
const layoutBounds = bounds.find(c => c.name === 'FacultyHubLayout');
const layoutImports = `import React, { useState, useEffect, Suspense } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "./Shared";

// We will inject the page component dynamically from App.jsx so we pass it as children
export default function FacultyHubLayout({ user, onLogout, modalState, setModalState, activeTopNav, setActiveTopNav, children }) {
`;
// Replace the start of the layout function
let layoutCode = getCode(layoutBounds.start + 1, layoutBounds.end);
// In the original layout, <PageComponent /> was rendered. We replace it with {children}.
layoutCode = layoutCode.replace(/<PageComponent \/>/, "{children}");
layoutCode = layoutCode.replace(/const activePage = .*?;/, "");
layoutCode = layoutCode.replace(/const PageComponent = .*?;/, "");
layoutCode = layoutCode.replace(/const meta = .*?;/, `const meta = { title: "Menu", sub: "", btn: "" };`);

fs.writeFileSync('src/components/FacultyHubLayout.jsx', layoutImports + layoutCode);

// Write a new App.jsx
const newAppJsx = `import React, { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation, Link } from "react-router-dom";
import { ProtectedRoute } from "./components/Shared";
import FacultyHubLayout from "./components/FacultyHubLayout";
import Login from "./pages/Login";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const FacultyDirectory = lazy(() => import("./pages/FacultyDirectory"));
const SubjectLoadTracker = lazy(() => import("./pages/SubjectLoadTracker"));
const ScheduleAssignment = lazy(() => import("./pages/ScheduleAssignment"));
const AttendanceMonitoring = lazy(() => import("./pages/AttendanceMonitoring"));
const LeaveApplication = lazy(() => import("./pages/LeaveApplication"));
const SalaryGrade = lazy(() => import("./pages/SalaryGrade"));
const TeachingHistory = lazy(() => import("./pages/TeachingHistory"));
const ClearanceSystem = lazy(() => import("./pages/ClearanceSystem"));
const EvaluationSummary = lazy(() => import("./pages/EvaluationSummary"));

export default function FacultyHub() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; } catch { return null; }
  });
  const [modalState, setModalState] = useState(null);
  const [activeTopNav, setActiveTopNav] = useState("Faculty Hub Home");

  const handleLogin = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setIsAuthenticated(true);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const Wrap = ({ Component, id }) => {
     return (
        <FacultyHubLayout user={user} onLogout={handleLogout} modalState={modalState} setModalState={setModalState} activeTopNav={activeTopNav} setActiveTopNav={setActiveTopNav}>
           <Component />
        </FacultyHubLayout>
     );
  };

  return (
    <Router>
      <Suspense fallback={<div style={{padding: 40}}>Loading...</div>}>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        <Route path="/dashboard" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={Dashboard} id="dashboard" /></ProtectedRoute>} />
        <Route path="/faculty" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={FacultyDirectory} id="faculty" /></ProtectedRoute>} />
        <Route path="/subjects" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={SubjectLoadTracker} id="subjects" /></ProtectedRoute>} />
        <Route path="/schedule" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={ScheduleAssignment} id="schedule" /></ProtectedRoute>} />
        <Route path="/attendance" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={AttendanceMonitoring} id="attendance" /></ProtectedRoute>} />
        <Route path="/leave" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={LeaveApplication} id="leave" /></ProtectedRoute>} />
        <Route path="/salary" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={SalaryGrade} id="salary" /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={TeachingHistory} id="history" /></ProtectedRoute>} />
        <Route path="/clearance" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={ClearanceSystem} id="clearance" /></ProtectedRoute>} />
        <Route path="/evaluation" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={EvaluationSummary} id="evaluation" /></ProtectedRoute>} />
        
        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
}
`;

fs.writeFileSync('src/App.jsx', newAppJsx);
