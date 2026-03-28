const fs = require('fs');
const content = fs.readFileSync('src/App.jsx', 'utf-8');

// Find the boundaries of each function
const extractComponent = (name) => {
  const regex = new RegExp(`^function ${name}\\(.*?\\) \\{[\\s\\S]*?^\\}\\n`, 'm');
  const match = content.match(regex);
  return match ? match[0] : '';
};

const pages = [
  'Dashboard', 'FacultyDirectory', 'SubjectLoadTracker', 'ScheduleAssignment',
  'AttendanceMonitoring', 'LeaveApplication', 'SalaryGrade', 'TeachingHistory',
  'ClearanceSystem', 'EvaluationSummary', 'Login'
];

let sharedCode = content.substring(0, content.indexOf('function FormModal'));
let formModalCode = extractComponent('FormModal');
let protectedRouteCode = extractComponent('ProtectedRoute');
let facultyHubLayoutCode = extractComponent('FacultyHubLayout');
let facultyHubCode = extractComponent('FacultyHub'); // Default export

// Generate Shared.jsx
let sharedJsx = `import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

${sharedCode}
${formModalCode}

export {
  SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar,
  inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal
};
`;

// It seems inputStyle etc are defined in sharedCode, but we need to check if they are exported correctly.
// Let's just export them. We'll append exports to Shared.jsx
fs.writeFileSync('src/components/Shared.jsx', sharedJsx);

pages.forEach(page => {
  const code = extractComponent(page);
  const imports = `import React, { useState, useEffect } from "react";
import { SIDEBAR_BG, ACCENT, CONTENT_BG, LOGO_SRC, Icons, NAV_ITEMS, badge, Avatar, inputStyle, btnPrimary, btnOutline, selectStyle, iconBtn, apiFetch, FormModal } from "../components/Shared";

`;
  if (code) {
    fs.writeFileSync(`src/pages/${page}.jsx`, imports + "export default " + code);
  }
});

// Update FacultyHubLayout to import the pages or replace its <PageComponent /> logic.
// We'll rewrite App.jsx entirely.
