const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir, { recursive: true });
  console.log(`Created directory: ${pagesDir}`);
}

const pageFiles = [
  'AboutPage.js',
  'Home.js',
  'JoinOurTeam.js',
  'MeetLocalChefs.js'
];

pageFiles.forEach(fileName => {
  const filePath = path.join(pagesDir, fileName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Skipped (already exists): ${filePath}`);
  }
});

console.log("\nAll page files have been created successfully.");
