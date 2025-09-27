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
if (!manifest.background) {
  manifest.background = {};
}
manifest.background.service_worker = 'background.js';
manifest.background.type = 'module';

if (!manifest.content_scripts) {
  manifest.content_scripts = [{ matches: ['<all_urls>'] }];
}
if (!manifest.content_scripts[0]) {
  manifest.content_scripts[0] = { matches: ['<all_urls>'] };
}
manifest.content_scripts[0].js = ['contentScript.js'];

// Update HTML file references
manifest.chrome_url_overrides = {
  newtab: 'newtab.html'
};

manifest.side_panel = {
  default_path: 'sidepanel.html'
};

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

// Copy simple background script if the built one has issues
const simpleBackgroundPath = path.resolve(rootDir, 'src/background/background-simple.js');
const distBackgroundPath = path.resolve(distDir, 'background.js');

if (fs.existsSync(simpleBackgroundPath)) {
  // Check if the built background.js has import issues
  const builtBackground = fs.readFileSync(distBackgroundPath, 'utf8');
  if (builtBackground.includes('import') && builtBackground.includes('from')) {
    console.log('Replacing background.js with simple version');
    fs.copyFileSync(simpleBackgroundPath, distBackgroundPath);
  }
}

console.log('Extension build completed!');