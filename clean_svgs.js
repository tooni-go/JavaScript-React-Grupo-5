const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'frontend', 'public');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.svg'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all on[event]="none" with empty string
  const newContent = content.replace(/on[a-z]+="none"\s*/g, '');
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Cleaned up events in ${file}`);
  }
});
