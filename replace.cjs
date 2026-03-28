const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist') {
        filelist = walkSync(filePath, filelist);
      }
    } else {
      if (filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        filelist.push(filePath);
      }
    }
  });
  return filelist;
};

const files = [...walkSync(path.join(__dirname, 'src')), ...walkSync(path.join(__dirname, 'backend'))];

const replacements = [
  { regex: /\bEngineering\b/g, replacement: "Information Assurance and Security 2" },
  { regex: /\bMathematics\b/g, replacement: "Business Process Management in IT" },
  { regex: /\bComputer Science\b/g, replacement: "Network Implementation and Support II" },
  { regex: /\bBusiness\b/g, replacement: "System Administration and Maintenance" },
  { regex: /\binit\b/g, replacement: "initials" },
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  replacements.forEach(({ regex, replacement }) => {
    content = content.replace(regex, replacement);
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});

console.log('All replacements done.');
