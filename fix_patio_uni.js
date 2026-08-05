const fs = require('fs');

let content = fs.readFileSync('frontend/public/PlantaBaja.svg', 'utf8');

// Rename rect51 (Patio UNI) to Aula-Patio-1
content = content.replace(/id="rect51"/g, 'id="Aula-Patio-1"');
content = content.replace(/id="rect52"/g, 'id="Aula-Patio-2"'); // Just in case rect52 is another patio area between them

fs.writeFileSync('frontend/public/PlantaBaja.svg', content, 'utf8');
console.log('Renamed Patio UNI');
