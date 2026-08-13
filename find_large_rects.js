const fs = require('fs');
const content = fs.readFileSync('frontend/public/PlantaBaja.svg', 'utf8');

const regex = /<rect[^>]+>/g;
let match;
const rects = [];
while ((match = regex.exec(content)) !== null) {
  const attrs = match[0];
  const idM = attrs.match(/id="([^"]+)"/);
  const xM = attrs.match(/x="([^"]+)"/);
  const yM = attrs.match(/y="([^"]+)"/);
  const wM = attrs.match(/width="([^"]+)"/);
  const hM = attrs.match(/height="([^"]+)"/);
  
  if (idM && xM && yM && wM && hM) {
    const id = idM[1];
    const x = parseFloat(xM[1]);
    const y = parseFloat(yM[1]);
    const w = parseFloat(wM[1]);
    const h = parseFloat(hM[1]);
    if (w > 100 || h > 100) {
      rects.push({ id, x, y, w, h });
    }
  }
}
console.log("Large rects:");
console.table(rects);

// Also look for "UNI"
const texts = [...content.matchAll(/<tspan[^>]*>([^<]+)<\/tspan>/g)];
console.log("Texts matching UNI:");
console.log(texts.filter(t => t[1].includes('UNI')).map(t => t[1]));
