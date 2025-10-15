// backup.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const backupDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// List of files and folders to back up
const itemsToBackup = [
  'package.json',
  'package-lock.json',
  'src/components',
  'src/pages',
  'src/assets',
  'public'
];

itemsToBackup.forEach((item) => {
  const srcPath = path.join(__dirname, item);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(backupDir, path.basename(item));
    // Remove existing backup if any
    if (fs.existsSync(destPath)) {
      execSync(`rm -rf "${destPath}"`);
    }
    // Copy the item
    execSync(`cp -r "${srcPath}" "${destPath}"`);
    console.log(`✅ Backed up: ${item}`);
  } else {
    console.log(`⚠️ Skipped (not found): ${item}`);
  }
});

console.log('\n🎉 Backup completed successfully!');
