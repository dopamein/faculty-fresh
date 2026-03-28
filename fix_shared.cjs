const fs = require('fs');
let content = fs.readFileSync('src/components/Shared.jsx', 'utf8');

const styles = `
const selectStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "6px 10px",
  fontSize: 13,
  color: "#374151",
  background: "#fff",
  cursor: "pointer",
};
const inputStyle = {
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "7px 12px",
  fontSize: 13,
  color: "#374151",
  outline: "none",
  width: "100%",
  boxSizing: "border-box",
};
const btnOutline = {
  background: "#ffffff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "7px 14px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  whiteSpace: "nowrap",
};
const btnPrimary = {
  background: SIDEBAR_BG,
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "7px 14px",
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 600,
  whiteSpace: "nowrap",
};
const iconBtn = {
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  padding: "4px 8px",
  cursor: "pointer",
  fontSize: 13,
};
`;

const lines = content.split('\n');
const exportLine = lines.findIndex(l => l.startsWith('export {'));
if (exportLine > -1) {
  lines.splice(exportLine, 0, styles);
  fs.writeFileSync('src/components/Shared.jsx', lines.join('\n'));
}

