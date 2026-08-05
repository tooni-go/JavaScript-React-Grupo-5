const fs = require('fs');
const content = fs.readFileSync('frontend/public/PlantaBaja.svg', 'utf8');

const regex = /<rect[^>]*\bid="([^"]*)"[^>]*\bx="([^"]*)"[^>]*\by="([^"]*)"/g;
let match;
const rects = [];
while ((match = regex.exec(content)) !== null) {
  rects.push({ id: match[1], x: parseFloat(match[2]), y: parseFloat(match[3]) });
}

// Fallback search ignoring attribute order
const rects2 = [];
const rectTagRegex = /<rect([^>]+)>/g;
while ((match = rectTagRegex.exec(content)) !== null) {
  const attrs = match[1];
  const idMatch = attrs.match(/id="([^"]+)"/);
  const xMatch = attrs.match(/x="([^"]+)"/);
  const yMatch = attrs.match(/y="([^"]+)"/);
  if (idMatch && xMatch && yMatch) {
    rects2.push({ id: idMatch[1], x: parseFloat(xMatch[1]), y: parseFloat(yMatch[1]), attrs });
  }
}

console.log("Aula 22 candidates (x near 597, y near 148):");
console.log(rects2.filter(r => r.x > 570 && r.x < 620 && r.y > 110 && r.y < 160).map(r => r.id));

console.log("Comedor candidates (x near 411, y near 190):");
console.log(rects2.filter(r => r.x > 300 && r.x < 550 && r.y > 100 && r.y < 300).map(r => `${r.id} (x:${r.x}, y:${r.y})`));

console.log("Patio 1 candidates (x near 665, y near 525 for 'Patio Taller' or 426, 526):");
console.log(rects2.filter(r => (r.x > 600 && r.x < 700 && r.y > 450 && r.y < 600) || (r.x > 350 && r.x < 500 && r.y > 450 && r.y < 600)).map(r => `${r.id} (x:${r.x}, y:${r.y})`));
