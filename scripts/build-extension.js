import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
const manifest = JSON.parse(fs.readFileSync(path.resolve(rootDir, 'manifest.json'), 'utf8'));

// Update manifest paths for built files
manifest.background.service_worker = 'background.js';
manifest.content_scripts[0].js = ['contentScript.js'];

// Write updated manifest
fs.writeFileSync(
  path.resolve(distDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// Copy public directory
const publicDir = path.resolve(rootDir, 'public');
const copyDirectory = (source, destination) => {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
  }

  const files = fs.readdirSync(source);
  for (const file of files) {
    const sourcePath = path.join(source, file);
    const destPath = path.join(destination, file);
    
    if (fs.lstatSync(sourcePath).isDirectory()) {
      copyDirectory(sourcePath, destPath);
    } else {
      fs.copyFileSync(sourcePath, destPath);
    }
  }
};

if (fs.existsSync(publicDir)) {
  copyDirectory(publicDir, distDir);
}

console.log('Extension build completed!');