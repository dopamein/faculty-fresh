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
  { regex: /System Administration and Maintenance Process Management in IT/g, replacement: "Business Process Management in IT" }
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
