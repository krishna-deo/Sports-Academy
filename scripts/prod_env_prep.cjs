const fs = require('fs');
const path = require('path');

// Target directory containing built JS/CSS files
const distDir = path.join(__dirname, '../dist');

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.html') || file.endsWith('.css'))) {
      let content = fs.readFileSync(filePath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        console.log(`Rewriting API endpoint in: ${filePath}`);
        // Replace all instances of 'http://localhost:5000' with empty string (relative paths)
        content = content.replace(/http:\/\/localhost:5000/g, '');
        fs.writeFileSync(filePath, content, 'utf8');
      }
    }
  }
}

if (fs.existsSync(distDir)) {
  console.log('Production build files found. Starting API endpoint rewrites...');
  walkDir(distDir);
  console.log('API endpoint rewrites completed successfully!');
} else {
  console.error('Error: dist directory not found. Run "npm run build" first.');
}
