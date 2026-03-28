import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      onLogin(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "radial-gradient(circle at top right, #332b72 0%, #202b68 30%, #21357a 70%, #1e1e55 100%)",
      fontFamily: "Inter, system-ui, sans-serif",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ position: "absolute", top: "-15%", left: "-10%", width: "60%", height: "60%", background: "radial-gradient(circle, rgba(51,43,114,0.7), transparent 70%)", borderRadius: "50%" }} />
      <div style={{ position: "absolute", bottom: "-20%", right: "-10%", width: "70%", height: "70%", background: "radial-gradient(circle, rgba(33,53,122,0.6), transparent 70%)", borderRadius: "50%" }} />

      <div style={{
        background: "#fff",
        padding: "45px 40px",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        width: "100%",
        maxWidth: "380px",
        position: "relative",
        zIndex: 10
      }}>
        <div style={{ textAlign: "center", marginBottom: "35px" }}>
          <img src={LOGO_SRC} alt="Logo" style={{ height: "65px", marginBottom: "16px", borderRadius: "50%", border: "1px solid #e5e7eb", padding: "2px" }} />
          <h2 style={{ margin: 0, color: "#1e1e55", fontSize: "22px", fontWeight: "800", letterSpacing: "-0.5px" }}>Faculty-Hub</h2>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: "14px", fontWeight: "500" }}>Automated Online Learning System</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "12px", fontWeight: "700", color: "#111827" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="5" width="18" height="14" rx="2" ry="2"/><polyline points="3 7 12 13 21 7"/></svg>
              Email Address
            </label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your email" required style={{ width: "100%", padding: "12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "all 0.2s" }} onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }} onBlur={e => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }} />
          </div>

          <div>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px", fontSize: "12px", fontWeight: "700", color: "#111827" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required style={{ width: "100%", padding: "12px 40px 12px 14px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "all 0.2s" }} onFocus={e => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px rgba(59,130,246,0.1)"; }} onBlur={e => { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none"; }} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", padding: 0, cursor: "pointer", color: "#9ca3af" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {showPassword ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> : <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}
                </svg>
              </button>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", padding: "12px", borderRadius: "8px", fontSize: "12px", display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", fontWeight: "500" }}>
            <div style={{ background: "#16a34a", color: "#fff", borderRadius: "50%", width: "16px", height: "16px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            Secure login &ndash; CAPTCHA appears after 3 failed attempts
          </div>

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", padding: "12px", borderRadius: "8px", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", fontWeight: "500" }}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>{error}</div>}

          <button type="submit" disabled={loading} style={{ background: "#202b68", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", cursor: "pointer", fontSize: "15px", fontWeight: "700", marginTop: "6px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#2a3a8a"} onMouseLeave={e => e.currentTarget.style.background = "#202b68"}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div style={{ background: "#f9fafb", color: "#6b7280", padding: "10px", borderRadius: "6px", fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", marginTop: "24px", justifyContent: "center" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#9ca3af"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          Locked for 30 min after 5 failed attempts.
        </div>
      </div>
    </div>
  );
}