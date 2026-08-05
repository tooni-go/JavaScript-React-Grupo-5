const fs = require('fs');
const content = fs.readFileSync('frontend/public/PlantaBaja.svg', 'utf8');

const regex = /<path[^>]+>/g;
let match;
while ((match = regex.exec(content)) !== null) {
  const attrs = match[0];
  const idM = attrs.match(/id="([^"]+)"/);
  const dM = attrs.match(/d="([^"]+)"/);
  
  if (idM && dM) {
    const id = idM[1];
    const d = dM[1];
    // Very simple check: if the path has a lot of commands or spans a wide area
    const coords = [...d.matchAll(/([0-9.-]+),([0-9.-]+)/g)];
    if (coords.length > 5) {
      const xs = coords.map(c => parseFloat(c[1]));
      const ys = coords.map(c => parseFloat(c[2]));
      // Note: SVG paths can use relative commands (m, l instead of M, L) so absolute min/max isn't perfectly trivial, 
      // but if the first command is absolute, we get a hint.
      console.log(`Path: ${id}, commands: ${coords.length}, starting near: ${xs[0]}, ${ys[0]}`);
    }
  }
}

// Check texts for exact coordinates
const textRegex = /<tspan[^>]*x="([^"]+)"[^>]*y="([^"]+)"[^>]*>([^<]+)<\/tspan>/g;
while ((match = textRegex.exec(content)) !== null) {
  if (match[3].includes('UNI') || match[3].includes('Comedor')) {
    console.log(`Text '${match[3]}' at x:${match[1]}, y:${match[2]}`);
  }
}
