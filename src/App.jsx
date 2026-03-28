import React, { useState, useEffect, lazy, Suspense } from "react";
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
        <FacultyHubLayout user={user} onLogout={handleLogout} modalState={modalState} setModalState={setModalState} activeTopNav={activeTopNav} setActiveTopNav={setActiveTopNav} activePage={id}>
           <Component user={user} />
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
        <Route path="/salary" element={<ProtectedRoute isAuthenticated={isAuthenticated} requireAdmin user={user}><Wrap Component={SalaryGrade} id="salary" /></ProtectedRoute>} />
        <Route path="/history" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={TeachingHistory} id="history" /></ProtectedRoute>} />
        <Route path="/clearance" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={ClearanceSystem} id="clearance" /></ProtectedRoute>} />
        <Route path="/evaluation" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Wrap Component={EvaluationSummary} id="evaluation" /></ProtectedRoute>} />
        
        <Route path="/*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
}
