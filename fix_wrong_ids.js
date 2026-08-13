const fs = require('fs');

let content = fs.readFileSync('frontend/public/PlantaBaja.svg', 'utf8');

// Revert the wrong ones
content = content.replace(/id="Aula-Comedor"/g, 'id="path47"');
content = content.replace(/id="Aula-Patio-1"/g, 'id="muro_patio"');

// Wait, where is the real Comedor?
// The text says "Comedor UNR" at x=411, y=190.
// Let's look for rects or paths around there.
// We previously found: 
// { type: 'rect', id: 'rect52', x: 508.24451, y: 232.0033 },
// { type: 'rect', id: 'rect51', x: 355.86594, y: 236.21996 },
// { type: 'rect', id: 'rect42', x: 507.79379, y: 131.72748 }
// Wait, the "Comedor UNR" is a big space. It might be drawn with multiple rects, or maybe the text is just there but there's NO specific rect for the Comedor?
// Wait, in the image, the Comedor UNR is in the top left, in a big L-shaped room. 
// "Patio UNI" is to the left of "Patio Verde".
// Wait, if "Patio UNI" is at the left, maybe the user said "Patio UNI" (not "Patio uno"). "el patio uni no se marca" -> Yes! "Patio UNI" makes perfect sense.
// If it's Patio UNI, the text is at some X, Y.
// Let's search for "UNI" text in the SVG.

fs.writeFileSync('frontend/public/PlantaBaja.svg', content, 'utf8');
console.log('Reverted wrong IDs');
