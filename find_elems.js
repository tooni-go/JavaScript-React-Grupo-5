const fs = require('fs');
const content = fs.readFileSync('frontend/public/PlantaBaja.svg', 'utf8');

const elems = [];
const regex = /<(rect|path)([^>]+)>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const type = match[1];
  const attrs = match[2];
  const idMatch = attrs.match(/id="([^"]+)"/);
  
  let x = null, y = null;
  if (type === 'rect') {
    const xM = attrs.match(/x="([^"]+)"/);
    const yM = attrs.match(/y="([^"]+)"/);
    if (xM) x = parseFloat(xM[1]);
    if (yM) y = parseFloat(yM[1]);
  } else if (type === 'path') {
    const dMatch = attrs.match(/d="m\s+([0-9.-]+),([0-9.-]+)/i);
    if (dMatch) {
      x = parseFloat(dMatch[1]);
      y = parseFloat(dMatch[2]);
    }
  }
  
  if (idMatch && x !== null && y !== null) {
    elems.push({ type, id: idMatch[1], x, y });
  }
}

console.log("Comedor candidates (x near 411, y near 190):");
console.log(elems.filter(r => r.x > 300 && r.x < 550 && r.y > 100 && r.y < 250));

console.log("Patio 1 candidates (x near 426, y near 526):");
console.log(elems.filter(r => r.x > 350 && r.x < 500 && r.y > 450 && r.y < 600));

console.log("Patio 2 candidates (x near 665, y near 525):");
console.log(elems.filter(r => r.x > 600 && r.x < 700 && r.y > 450 && r.y < 600));
